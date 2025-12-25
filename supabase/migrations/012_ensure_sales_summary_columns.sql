-- 确保销量汇总字段存在
-- 修复 schema cache 错误：Could not find the 'total_tang_count' column

-- 销量模块汇总字段（确保所有汇总字段都存在）
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_bing_count integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_tang_count integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_mixian_count integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_chaomian_count integer DEFAULT 0;

-- 添加注释
COMMENT ON COLUMN daily_records.total_bing_count IS '饼类产品销量汇总';
COMMENT ON COLUMN daily_records.total_tang_count IS '汤粥类产品销量汇总';
COMMENT ON COLUMN daily_records.total_mixian_count IS '米线面类产品销量汇总';
COMMENT ON COLUMN daily_records.total_chaomian_count IS '炒面河粉类产品销量汇总';

-- 刷新 PostgREST schema cache（如果支持）
-- 注意：这需要在 Supabase Dashboard SQL Editor 中手动执行
-- SELECT pg_notify('pgrst', 'reload schema');

