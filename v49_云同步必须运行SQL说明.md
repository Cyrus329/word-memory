# v49 云同步修正版

这版把云同步重新作为主按钮。

如果页面提示：`Could not query the database for the schema cache`，说明 Supabase 云端没有建好函数，不是 GitHub 上传问题。

处理：

1. 打开 Supabase 项目。
2. 进入 SQL Editor。
3. 新建查询，复制 `supabase-word-memory-repair.sql` 全部内容。
4. 点击 Run。
5. 等 30 秒，再回网页点“保存并开启云同步”。

运行成功后，结果里应出现：

- load_word_memory_cloud
- save_word_memory_cloud
- verify_word_memory_cloud_pin
