-- 添加唯一约束，确保每个用户每天只有一条记录
-- 先删除可能存在的重复数据（保留最新的记录）

-- 1. 删除重复数据，只保留每个(user_id, record_date)组合中created_at最新的记录
DELETE FROM daily_records
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, record_date) id
  FROM daily_records
  ORDER BY user_id, record_date, created_at DESC
);

-- 2. 添加唯一约束
ALTER TABLE daily_records 
ADD CONSTRAINT unique_user_date UNIQUE (user_id, record_date);

-- 3. 确保索引存在（如果不存在会自动创建）
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_date ON daily_records(user_id, record_date);

