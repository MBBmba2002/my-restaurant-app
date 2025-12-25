-- 添加唯一约束，确保每个用户每天只有一条记录
-- 这是 upsert 操作正常工作所必需的

-- 先删除可能存在的重复数据（保留最新的）
DELETE FROM daily_records a
USING daily_records b
WHERE a.id < b.id
  AND a.user_id = b.user_id
  AND a.record_date = b.record_date;

-- 添加唯一约束
ALTER TABLE daily_records
ADD CONSTRAINT daily_records_user_date_unique 
UNIQUE (user_id, record_date);

-- 添加注释
COMMENT ON CONSTRAINT daily_records_user_date_unique ON daily_records IS 
'确保每个用户每天只有一条记录，支持 upsert 操作';

