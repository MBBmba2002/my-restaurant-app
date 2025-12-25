-- 新增支出汇总字段到 daily_records 表
-- 支持自动计算各分类小计和当日总支出

-- 支出分类汇总字段 (numeric, 默认 0)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expense_raw numeric(12, 2) DEFAULT 0;      -- 原材料总计
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expense_fix numeric(12, 2) DEFAULT 0;      -- 固定费总计
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expense_cons numeric(12, 2) DEFAULT 0;     -- 消耗品总计
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expense_other numeric(12, 2) DEFAULT 0;    -- 其他总计

-- 当日总支出汇总字段
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_daily_expense numeric(12, 2) DEFAULT 0;    -- 当日总支出

-- 为汇总字段添加注释
COMMENT ON COLUMN daily_records.total_expense_raw IS '原材料支出分类汇总';
COMMENT ON COLUMN daily_records.total_expense_fix IS '固定费用支出分类汇总';
COMMENT ON COLUMN daily_records.total_expense_cons IS '消耗品支出分类汇总';
COMMENT ON COLUMN daily_records.total_expense_other IS '其他支出分类汇总';
COMMENT ON COLUMN daily_records.total_daily_expense IS '当日总支出汇总';
