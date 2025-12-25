-- 最终字段验证与补全
-- 确保所有代码中引用的数据库字段都存在，避免提交失败

-- 基础收入字段验证
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS income_wechat numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS income_alipay numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS income_cash numeric(12, 2) DEFAULT 0;

-- 产品销量字段验证 (确保所有SKU字段存在)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_bing integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_tang_su integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_su integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_rou integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_chaomian integer DEFAULT 0;

-- 详细饼类销量字段
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_roubing integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_shouroubing integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_changdanbing integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_roudanbing integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_danbing integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_changbing integer DEFAULT 0;

-- 汤粥类销量字段
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_fentang integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_hundun integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mizhou integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_doujiang integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_jidantang integer DEFAULT 0;

-- 米线面类销量字段
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_su_sanxian integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_su_suancai integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_su_mala integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_rou_sanxian integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_rou_suancai integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_rou_mala integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_suanlafen integer DEFAULT 0;

-- 炒面河粉类销量字段
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_chaomian_xiangcui integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_chaohefen_kuan integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_chaohefen_xi integer DEFAULT 0;

-- 支出字段验证 (确保所有支出字段存在)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_veg numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_meat numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_egg numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_noodle numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_spice numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_pack numeric(12, 2) DEFAULT 0;

ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_fix_rent numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_fix_utility numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_fix_gas numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_fix_salary numeric(12, 2) DEFAULT 0;

ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_cons_name text;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_cons_amount numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_cons_duration text;

ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_other_name text;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_other_amount numeric(12, 2) DEFAULT 0;

-- 支出汇总字段
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expense_raw numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expense_fix numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expense_cons numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expense_other numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_daily_expense numeric(12, 2) DEFAULT 0;

-- 最终汇总字段
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_income numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_sales integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expenses numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS estimated_profit numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS cogs_today numeric(12, 2) DEFAULT 0;

-- 兼容旧版本字段
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS expense_type text;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS expense_amount numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS expense_item_name text;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS usage_duration text;
