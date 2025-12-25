# Supabase Schema Cache Refresh

如果遇到 schema cache 相关的错误（例如：Could not find column in schema.cache），可以执行以下 SQL 来刷新 PostgREST schema cache：

```sql
SELECT pg_notify('pgrst', 'reload schema');
```

## 执行方式

1. 在 Supabase Dashboard 中打开 SQL Editor
2. **先运行 migration 文件**（确保所有列都存在）：
   - `011_add_unique_constraint_user_date.sql` - 添加唯一约束
   - `012_ensure_sales_summary_columns.sql` - 确保销量汇总列存在
3. 然后执行刷新 schema cache 的 SQL：
   ```sql
   SELECT pg_notify('pgrst', 'reload schema');
   ```
4. 等待几秒钟让缓存刷新

## 常见错误修复

### 错误：Could not find the 'total_tang_count' column (Code: PGRST204)

**原因**：列不存在或 schema cache 未刷新

**解决步骤**：
1. 运行 migration `012_ensure_sales_summary_columns.sql` 确保列存在
2. 执行 `SELECT pg_notify('pgrst', 'reload schema');` 刷新缓存
3. 如果仍有问题，检查 Supabase Dashboard → Table Editor → daily_records，确认列是否存在

## 注意事项

- 代码不依赖旧的 generated types
- 所有字段名以实际数据库表结构为准
- 如果迁移文件已更新但数据库未同步，需要先运行迁移
- Migration 文件按数字顺序执行（001, 002, 003...）

