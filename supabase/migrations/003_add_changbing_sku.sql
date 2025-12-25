-- 添加肠饼产品销量字段
-- 为饼类产品增加肠饼选项

ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_changbing integer DEFAULT 0;  -- 肠饼
