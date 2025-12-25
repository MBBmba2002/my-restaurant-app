-- 删除三鲜汤字段，优化汤粥类产品分类
-- 为实现更精确的产品管理，去除不必要的字段

-- 删除三鲜汤字段
ALTER TABLE daily_records DROP COLUMN IF EXISTS sku_sanxiantang;

-- 确保其他汤粥类字段存在（如果不存在则创建）
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_fentang integer DEFAULT 0;     -- 粉汤
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_hundun integer DEFAULT 0;      -- 馄炖
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mizhou integer DEFAULT 0;      -- 小米粥 (原sku_xiaomizhou)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_doujiang integer DEFAULT 0;    -- 豆浆
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_jidantang integer DEFAULT 0;   -- 鸡蛋汤
