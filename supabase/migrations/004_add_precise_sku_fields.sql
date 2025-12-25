-- 重构产品销量追踪：删除旧字段，新增精确字段
-- 为实现更精确的产品分类管理

-- 删除旧的不精确字段
ALTER TABLE daily_records DROP COLUMN IF EXISTS sku_mixian_su;
ALTER TABLE daily_records DROP COLUMN IF EXISTS sku_mixian_rou;
ALTER TABLE daily_records DROP COLUMN IF EXISTS sku_chaomian;

-- 新增精确的米线/面类字段
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_su_sanxian integer DEFAULT 0;     -- 【素】米线三鲜
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_su_suancai integer DEFAULT 0;     -- 【素】米线酸菜
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_su_mala integer DEFAULT 0;        -- 【素】米线麻辣
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_rou_sanxian integer DEFAULT 0;    -- 【肉】米线三鲜
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_rou_suancai integer DEFAULT 0;    -- 【肉】米线酸菜
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mixian_rou_mala integer DEFAULT 0;       -- 【肉】米线麻辣
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_suanlafen integer DEFAULT 0;            -- 酸辣粉

-- 新增精确的炒面/炒河粉类字段
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_chaomian_xiangcui integer DEFAULT 0;     -- 香脆炒面
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_chaohefen_kuan integer DEFAULT 0;        -- 【宽粉】炒河粉
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_chaohefen_xi integer DEFAULT 0;          -- 【细粉】炒河粉
