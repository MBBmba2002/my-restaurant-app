-- 新增支出字段到 daily_records 表
-- 支持详细的支出分类和成本核算

-- 原材料类支出 (numeric, 默认 0)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_veg numeric(12, 2) DEFAULT 0;        -- 蔬菜
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_meat numeric(12, 2) DEFAULT 0;       -- 肉类
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_egg numeric(12, 2) DEFAULT 0;        -- 鸡蛋
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_noodle numeric(12, 2) DEFAULT 0;     -- 粉/面
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_spice numeric(12, 2) DEFAULT 0;      -- 调味品
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_pack numeric(12, 2) DEFAULT 0;       -- 包装

-- 固定费用 (numeric, 默认 0)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_fix_rent numeric(12, 2) DEFAULT 0;       -- 房租
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_fix_utility numeric(12, 2) DEFAULT 0;    -- 水电
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_fix_gas numeric(12, 2) DEFAULT 0;        -- 煤气
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_fix_salary numeric(12, 2) DEFAULT 0;     -- 工资

-- 消耗品类 (text + numeric + text)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_cons_name text;                          -- 消耗品名称
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_cons_amount numeric(12, 2) DEFAULT 0;    -- 消耗品金额
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_cons_duration text;                      -- 使用时长 ('1个月', '1-3个月', '6个月以上', '1年以上')

-- 其他类 (text + numeric)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_other_name text;                         -- 其他支出名称
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_other_amount numeric(12, 2) DEFAULT 0;   -- 其他支出金额

-- 为支出字段添加注释
COMMENT ON COLUMN daily_records.exp_raw_veg IS '原材料支出 - 蔬菜';
COMMENT ON COLUMN daily_records.exp_raw_meat IS '原材料支出 - 肉类';
COMMENT ON COLUMN daily_records.exp_raw_egg IS '原材料支出 - 鸡蛋';
COMMENT ON COLUMN daily_records.exp_raw_noodle IS '原材料支出 - 粉/面';
COMMENT ON COLUMN daily_records.exp_raw_spice IS '原材料支出 - 调味品';
COMMENT ON COLUMN daily_records.exp_raw_pack IS '原材料支出 - 包装';

COMMENT ON COLUMN daily_records.exp_fix_rent IS '固定费用 - 房租';
COMMENT ON COLUMN daily_records.exp_fix_utility IS '固定费用 - 水电';
COMMENT ON COLUMN daily_records.exp_fix_gas IS '固定费用 - 煤气';
COMMENT ON COLUMN daily_records.exp_fix_salary IS '固定费用 - 工资';

COMMENT ON COLUMN daily_records.exp_cons_name IS '消耗品名称';
COMMENT ON COLUMN daily_records.exp_cons_amount IS '消耗品金额';
COMMENT ON COLUMN daily_records.exp_cons_duration IS '消耗品使用时长';

COMMENT ON COLUMN daily_records.exp_other_name IS '其他支出名称';
COMMENT ON COLUMN daily_records.exp_other_amount IS '其他支出金额';
