# Supabase RLS Policies for daily_records

## 当前策略

根据 `001_create_daily_records.sql`，表 `daily_records` 已启用 RLS (Row Level Security)，并有以下策略：

### 现有策略（已配置）

```sql
-- 启用 RLS
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;

-- 用户只能插入自己的记录
CREATE POLICY "Users can insert their own records" ON daily_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户只能查看自己的记录
CREATE POLICY "Users can select their own records" ON daily_records
  FOR SELECT USING (auth.uid() = user_id);

-- 用户只能更新自己的记录
CREATE POLICY "Users can update their own records" ON daily_records
  FOR UPDATE USING (auth.uid() = user_id);

-- 用户只能删除自己的记录
CREATE POLICY "Users can delete their own records" ON daily_records
  FOR DELETE USING (auth.uid() = user_id);
```

## 如果遇到 RLS 错误

### 错误症状
- `new row violates row-level security policy`
- `permission denied for table daily_records`
- `Code: 42501`

### 检查步骤

1. **确认 RLS 已启用**：
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'daily_records';
```

2. **查看现有策略**：
```sql
SELECT * FROM pg_policies WHERE tablename = 'daily_records';
```

3. **如果策略不存在，执行以下 SQL**（在 Supabase Dashboard SQL Editor 中）：

```sql
-- 确保 RLS 已启用
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;

-- 删除旧策略（如果存在）
DROP POLICY IF EXISTS "Users can insert their own records" ON daily_records;
DROP POLICY IF EXISTS "Users can select their own records" ON daily_records;
DROP POLICY IF EXISTS "Users can update their own records" ON daily_records;
DROP POLICY IF EXISTS "Users can delete their own records" ON daily_records;

-- 重新创建策略
CREATE POLICY "Users can insert their own records" ON daily_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own records" ON daily_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own records" ON daily_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own records" ON daily_records
  FOR DELETE USING (auth.uid() = user_id);
```

### 临时测试策略（仅用于调试，生产环境不推荐）

如果需要临时允许所有操作（仅用于调试），可以创建宽松策略：

```sql
-- ⚠️ 警告：仅用于调试，生产环境不安全
CREATE POLICY "Allow all for testing" ON daily_records
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

**注意**：调试完成后应立即删除此策略。

## 验证策略

执行以下查询验证策略是否生效：

```sql
-- 查看所有策略
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'daily_records';
```

## 常见问题

### Q: 为什么使用 anon key 还是报 RLS 错误？
A: RLS 策略基于 `auth.uid()`，需要用户已登录。确保：
1. 用户已通过 `supabase.auth.signInWithPassword()` 登录
2. `user.id` 与 `auth.uid()` 匹配
3. 写入时 `user_id` 字段设置为当前用户 ID

### Q: 如何检查当前用户 ID？
A: 在代码中：
```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user ID:', user?.id);
```

### Q: upsert 操作需要什么策略？
A: `upsert` 需要同时有 INSERT 和 UPDATE 策略。确保两个策略都存在。

