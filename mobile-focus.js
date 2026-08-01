(function (root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.MobileFocus = api;
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const MAX_GESTURE_ELAPSED_MS = 1400;
  const MIN_HORIZONTAL_SWIPE_PX = 64;
  const HORIZONTAL_DOMINANCE_RATIO = 1.25;
  const MEDIUM_TERM_LENGTH_THRESHOLD = 11;
  const LONG_TERM_LENGTH_THRESHOLD = 18;

  function classifyGesture({ dx, dy, elapsed }) {
    const horizontalDistance = Math.abs(dx);
    const verticalDistance = Math.abs(dy);

    if (
      elapsed > MAX_GESTURE_ELAPSED_MS
      || horizontalDistance < MIN_HORIZONTAL_SWIPE_PX
      || horizontalDistance <= verticalDistance * HORIZONTAL_DOMINANCE_RATIO
    ) {
      return 'none';
    }

    return dx < 0 ? 'next' : 'previous';
  }

  function termSizeClass(term) {
    const length = String(term || '').length;

    if (length > LONG_TERM_LENGTH_THRESHOLD) return 'long';
    if (length > MEDIUM_TERM_LENGTH_THRESHOLD) return 'medium';
    return 'normal';
  }

  function moveIndex(index, delta, total) {
    if (total <= 0) return 0;
    return Math.min(Math.max(index + delta, 0), total - 1);
  }

  function createController(adapter = {}) {
    const elements = adapter.elements || {};
    const environment = adapter.env || {};
    const windowObject = environment.window
      || (typeof window !== 'undefined' ? window : null);
    const documentObject = environment.document
      || (typeof document !== 'undefined' ? document : null);
    const historyObject = environment.history
      || windowObject?.history
      || (typeof history !== 'undefined' ? history : null);
    const timers = environment.timers || windowObject || globalThis;
    const now = typeof environment.now === 'function' ? environment.now : Date.now;
    const session = {
      active: false,
      ids: [],
      index: 0,
      revealed: false,
      locked: false,
      pointer: null,
      suppressClickUntil: 0,
    };
    let historyPushed = false;
    let bound = false;
    let pendingAdvanceTimer = null;
    let sessionGeneration = 0;

    function listen(element, type, listener) {
      element?.addEventListener?.(type, listener);
    }

    function setRatingLocked(locked) {
      session.locked = Boolean(locked);
      elements.ratingButtons?.forEach?.((button) => { button.disabled = session.locked; });
    }

    function cancelPendingAdvance() {
      sessionGeneration += 1;
      if (pendingAdvanceTimer !== null) {
        timers.clearTimeout?.(pendingAdvanceTimer);
        pendingAdvanceTimer = null;
      }
      setRatingLocked(false);
    }

    function currentId() {
      return session.ids[session.index] || null;
    }

    function currentWord() {
      while (session.index < session.ids.length) {
        const id = currentId();
        const word = id && typeof adapter.getWord === 'function' ? adapter.getWord(id) : null;
        if (word) return word;
        session.index += 1;
      }
      return null;
    }

    function setExpanded(revealed) {
      session.revealed = Boolean(revealed);
      if (elements.answer) elements.answer.hidden = !session.revealed;
      elements.card?.setAttribute?.('aria-expanded', String(session.revealed));
    }

    function setProgress(current, total) {
      const percent = total > 0 ? Math.round((current / total) * 100) : 0;
      if (elements.count) elements.count.textContent = `${current} / ${total}`;
      elements.progress?.setAttribute?.('aria-valuemin', '0');
      elements.progress?.setAttribute?.('aria-valuemax', '100');
      elements.progress?.setAttribute?.('aria-valuenow', String(percent));
      if (elements.progressFill?.style) elements.progressFill.style.width = `${percent}%`;
    }

    function renderEmpty(total) {
      const completed = total > 0 ? total : 0;
      setProgress(completed, total);
      if (elements.card) elements.card.hidden = true;
      if (elements.actions) elements.actions.hidden = true;
      if (elements.empty) elements.empty.hidden = false;
      setExpanded(false);
    }

    function render() {
      const total = session.ids.length;
      const word = currentWord();

      if (elements.title && typeof adapter.title === 'function') {
        elements.title.textContent = String(adapter.title() || '');
      }
      if (elements.source && typeof adapter.source === 'function') {
        elements.source.textContent = String(adapter.source() || '');
      }

      if (!word) {
        renderEmpty(total);
        return;
      }

      const view = typeof adapter.view === 'function' ? (adapter.view(word) || {}) : word;
      if (elements.card) elements.card.hidden = false;
      if (elements.actions) elements.actions.hidden = false;
      if (elements.empty) elements.empty.hidden = true;
      setProgress(session.index + 1, total);

      const term = String(view.term || word.term || '');
      if (elements.term) {
        elements.term.textContent = term;
        elements.term.classList?.remove?.('normal', 'medium', 'long');
        elements.term.classList?.add?.(termSizeClass(term));
      }
      if (elements.phonetic) {
        elements.phonetic.textContent = String(view.phonetic || '点击发音按钮听读');
      }

      if (typeof adapter.renderAnswer === 'function') {
        adapter.renderAnswer(view, {
          answer: elements.answer,
          meaning: elements.meaning,
          detail: elements.detail,
        }, word);
      } else {
        if (elements.meaning) elements.meaning.textContent = String(view.answer || '');
        if (elements.detail) elements.detail.textContent = String(view.example || '');
      }
      setExpanded(session.revealed);
    }

    function toggleReveal() {
      if (!session.active || !currentWord() || session.locked) return;
      setExpanded(!session.revealed);
    }

    function move(delta) {
      if (!session.active || session.locked || !session.ids.length) return;
      session.index = moveIndex(session.index, delta, session.ids.length);
      setExpanded(false);
      render();
    }

    function rate(result) {
      if (
        !session.active
        || session.locked
        || !['forgot', 'fuzzy', 'remember'].includes(result)
      ) return;
      const id = currentId();
      if (!id || !currentWord()) return;

      setRatingLocked(true);
      try {
        adapter.rate?.(id, result);
      } catch (error) {
        setRatingLocked(false);
        throw error;
      }

      const generation = sessionGeneration;
      pendingAdvanceTimer = timers.setTimeout(() => {
        if (!session.active || generation !== sessionGeneration) return;
        pendingAdvanceTimer = null;
        session.index = Math.min(session.index + 1, session.ids.length);
        setRatingLocked(false);
        setExpanded(false);
        render();
      }, 220);
    }

    function open() {
      if (session.active) return;
      cancelPendingAdvance();
      const queued = typeof adapter.queue === 'function' ? adapter.queue() : [];
      session.ids = Array.isArray(queued)
        ? queued.map((item) => (typeof item === 'string' ? item : item?.id)).filter(Boolean)
        : [];
      session.active = true;
      session.index = 0;
      session.pointer = null;
      session.suppressClickUntil = 0;
      setExpanded(false);
      if (elements.root) elements.root.hidden = false;
      documentObject?.body?.classList?.add?.('mobile-focus-active');
      try {
        historyObject?.pushState?.({ mobileFocus: true }, '', '#mobile-focus');
        historyPushed = Boolean(historyObject?.pushState);
      } catch {
        historyPushed = false;
      }
      render();
      if (currentWord()) {
        elements.card?.focus?.();
      } else {
        elements.exit?.focus?.();
      }
    }

    function close(options = {}) {
      const fromPopState = Boolean(options.fromPopState);
      if (!session.active) return;
      cancelPendingAdvance();
      session.active = false;
      session.pointer = null;
      setExpanded(false);
      if (elements.root) elements.root.hidden = true;
      documentObject?.body?.classList?.remove?.('mobile-focus-active');
      if (historyPushed && !fromPopState) {
        historyPushed = false;
        historyObject?.back?.();
      } else if (fromPopState) {
        historyPushed = false;
      }
      elements.entry?.focus?.();
    }

    function bind() {
      if (bound) return;
      bound = true;
      listen(elements.entry, 'click', open);
      listen(elements.exit, 'click', () => close());
      listen(elements.card, 'click', (event) => {
        if (event?.target === elements.audio || now() <= session.suppressClickUntil) return;
        toggleReveal();
      });
      listen(elements.card, 'keydown', (event) => {
        if (event?.target && event.target !== elements.card) return;
        if (event?.key !== 'Enter' && event?.key !== ' ') return;
        event.preventDefault?.();
        toggleReveal();
      });
      listen(elements.audio, 'click', (event) => {
        event.stopPropagation?.();
        const word = currentWord();
        if (session.active && word) adapter.speak?.(word);
      });
      elements.ratingButtons?.forEach?.((button) => {
        listen(button, 'click', (event) => {
          event.stopPropagation?.();
          rate(button.dataset?.mobileFocusRate);
        });
      });
      listen(elements.card, 'pointerdown', (event) => {
        if (!session.active || session.locked || (event.button != null && event.button !== 0)) return;
        session.pointer = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          time: now(),
        };
      });
      listen(elements.card, 'pointerup', (event) => {
        const pointer = session.pointer;
        session.pointer = null;
        if (!pointer || (event.pointerId != null && pointer.id !== event.pointerId)) return;
        const gesture = classifyGesture({
          dx: event.clientX - pointer.x,
          dy: event.clientY - pointer.y,
          elapsed: now() - pointer.time,
        });
        if (gesture === 'none') return;
        session.suppressClickUntil = now() + 400;
        move(gesture === 'next' ? 1 : -1);
      });
      listen(elements.card, 'pointercancel', () => { session.pointer = null; });
      listen(windowObject, 'popstate', () => close({ fromPopState: true }));
    }

    bind();

    return {
      open,
      close,
      render,
      rate,
      move,
      toggleReveal,
      session,
    };
  }

  return {
    classifyGesture,
    termSizeClass,
    moveIndex,
    createController,
  };
}));
