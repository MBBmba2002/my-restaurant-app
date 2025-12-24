-- 添加详细产品销量追踪字段
-- 为 daily_records 表添加20多个产品的销量字段

-- 饼类产品
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_roubing integer DEFAULT 0;  -- 肉饼
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_shouroubing integer DEFAULT 0;  -- 瘦肉饼
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_changdanbing integer DEFAULT 0;  -- 肠蛋饼
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_roudanbing integer DEFAULT 0;  -- 肉蛋饼
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_danbing integer DEFAULT 0;  -- 蛋饼

-- 汤类(素)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_fentang integer DEFAULT 0;  -- 粉汤
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_hundun integer DEFAULT 0;  -- 馄炖
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_xiaomizhou integer DEFAULT 0;  -- 小米粥
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_doujiang integer DEFAULT 0;  -- 豆浆
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_jidantang integer DEFAULT 0;  -- 鸡蛋汤
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_sanxiantang integer DEFAULT 0;  -- 三鲜汤

-- 【素】米线/面
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_sanxian_su integer DEFAULT 0;  -- 三鲜(素)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_suancai_su integer DEFAULT 0;  -- 酸菜(素)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mala_su integer DEFAULT 0;  -- 麻辣(素)

-- 【肉】米线/面
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_sanxian_rou integer DEFAULT 0;  -- 三鲜(肉)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_suancai_rou integer DEFAULT 0;  -- 酸菜(肉)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_mala_rou integer DEFAULT 0;  -- 麻辣(肉)
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_malamixian integer DEFAULT 0;  -- 麻辣米线

-- 酸辣粉
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_suanlafen integer DEFAULT 0;  -- 酸辣粉

-- 炒面/炒河粉
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_xiangcuichaomian integer DEFAULT 0;  -- 香脆炒面
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_suancaichaohufenkuan integer DEFAULT 0;  -- 酸菜炒河粉[宽]
ALTER TABLE daily_records ADD COLUMN IF NOT EXISTS sku_malachaohufenxi integer DEFAULT 0;  -- 麻辣炒河粉[细]

