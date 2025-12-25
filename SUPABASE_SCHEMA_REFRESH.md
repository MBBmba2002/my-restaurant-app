# Supabase Schema Cache Refresh

如果遇到 schema cache 相关的错误（例如：Could not find column in schema.cache），可以执行以下 SQL 来刷新 PostgREST schema cache：

```sql
SELECT pg_notify('pgrst', 'reload schema');
```

## 执行方式

1. 在 Supabase Dashboard 中打开 SQL Editor
2. 执行上述 SQL 语句
3. 等待几秒钟让缓存刷新

## 注意事项

- 代码不依赖旧的 generated types
- 所有字段名以实际数据库表结构为准
- 如果迁移文件已更新但数据库未同步，需要先运行迁移

