-- ============================================
-- 修复 daily_records 表缺失字段
-- 在 Supabase Dashboard → SQL Editor 中执行此脚本
-- ============================================

-- ============================================
-- 1. 销量汇总字段（Integer，默认值 0）
-- ============================================
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_tang_count integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_mixian_count integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_chaomian_count integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_bing_count integer DEFAULT 0;

-- ============================================
-- 2. 详细销量字段（Integer，默认值 0）
-- ============================================
-- 饼类产品
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_roubing integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_shouroubing integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_changdanbing integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_roudanbing integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_danbing integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_changbing integer DEFAULT 0;

-- 汤粥类
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_fentang integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_hundun integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mizhou integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_doujiang integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_jidantang integer DEFAULT 0;

-- 米线面类（素）
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_su_sanxian integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_su_suancai integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_su_mala integer DEFAULT 0;

-- 米线面类（肉）
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_rou_sanxian integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_rou_suancai integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_rou_mala integer DEFAULT 0;

-- 酸辣粉
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_suanlafen integer DEFAULT 0;

-- 炒面河粉类
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_chaomian_xiangcui integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_chaohefen_kuan integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_chaohefen_xi integer DEFAULT 0;

-- 兼容旧字段
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_bing integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_tang_su integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_su integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_rou integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_chaomian integer DEFAULT 0;

-- ============================================
-- 3. 支出字段（Numeric(12,2)，默认值 0）
-- ============================================
-- 原材料支出
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_veg numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_meat numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_egg numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_noodle numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_spice numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_raw_pack numeric(12, 2) DEFAULT 0;

-- 固定费用
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_fix_rent numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_fix_utility numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_fix_gas numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_fix_salary numeric(12, 2) DEFAULT 0;

-- 消耗品（text + numeric）
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_cons_name text;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_cons_amount numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_cons_duration text;

-- 其他支出（text + numeric）
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_other_name text;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS exp_other_amount numeric(12, 2) DEFAULT 0;

-- ============================================
-- 4. 支出汇总字段（Numeric(12,2)，默认值 0）
-- ============================================
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expense_raw numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expense_fix numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expense_cons numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expense_other numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_daily_expense numeric(12, 2) DEFAULT 0;

-- ============================================
-- 5. 最终汇总字段（Numeric/Integer，默认值 0）
-- ============================================
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_income numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_sales integer DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS total_expenses numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS estimated_profit numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS cogs_today numeric(12, 2) DEFAULT 0;

-- ============================================
-- 6. 收入字段（Numeric(12,2)，默认值 0）
-- ============================================
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS income_wechat numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS income_alipay numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS income_cash numeric(12, 2) DEFAULT 0;

-- ============================================
-- 7. 兼容旧版本字段
-- ============================================
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS expense_type text;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS expense_amount numeric(12, 2) DEFAULT 0;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS expense_item_name text;
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS usage_duration text;

-- ============================================
-- 8. 添加唯一约束（支持 upsert）
-- ============================================
-- 先删除可能存在的重复数据（保留最新的）
DELETE FROM daily_records a
USING daily_records b
WHERE a.id < b.id
  AND a.user_id = b.user_id
  AND a.record_date = b.record_date;

-- 添加唯一约束（如果不存在）
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'daily_records_user_date_unique'
    ) THEN
        ALTER TABLE daily_records
        ADD CONSTRAINT daily_records_user_date_unique 
        UNIQUE (user_id, record_date);
    END IF;
END $$;

-- ============================================
-- 9. 刷新 PostgREST schema cache
-- ============================================
SELECT pg_notify('pgrst', 'reload schema');

-- ============================================
-- 10. 验证字段是否存在（可选）
-- ============================================
-- 执行以下查询查看所有 total_*_count 字段：
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'daily_records' 
-- AND column_name LIKE 'total_%_count'
-- ORDER BY column_name;

