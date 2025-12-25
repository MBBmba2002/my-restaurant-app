-- 新增最终汇总字段到 daily_records 表
-- 用于存储完整的经营数据汇总和净利润计算

-- 核心汇总字段 (numeric, 默认 0)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_income numeric(12, 2) DEFAULT 0;         -- 今日总收入
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_sales integer DEFAULT 0;                 -- 今日总销量（产品数量）
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expenses numeric(12, 2) DEFAULT 0;       -- 今日总支出
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS estimated_profit numeric(12, 2) DEFAULT 0;     -- 今日预计净利润
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS cogs_today numeric(12, 2) DEFAULT 0;           -- 今日经营成本

-- 为汇总字段添加注释
COMMENT ON COLUMN daily_records.total_income IS '今日总收入汇总（微信+支付宝+现金）';
COMMENT ON COLUMN daily_records.total_sales IS '今日总销量汇总（所有产品数量总和）';
COMMENT ON COLUMN daily_records.total_expenses IS '今日总支出汇总（所有支出分类总和）';
COMMENT ON COLUMN daily_records.estimated_profit IS '今日预计净利润（总收入-经营成本）';
COMMENT ON COLUMN daily_records.cogs_today IS '今日经营成本（原材料+固定费摊销）';
