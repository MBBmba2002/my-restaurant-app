-- 修复唯一约束（按照用户要求：date和date+product_name）
-- 注意：在多用户系统中，建议使用(user_id, date)组合，但按照用户要求先使用date

-- 1. 处理 daily_income 表的重复数据（保留最新的记录）
-- 如果存在多用户场景，建议使用(user_id, date)，但按用户要求使用date
DELETE FROM daily_income
WHERE id NOT IN (
  SELECT DISTINCT ON (date) id
  FROM daily_income
  ORDER BY date, created_at DESC
);

-- 添加约束（按用户要求：仅date）
DO $$ 
BEGIN
  -- 先删除可能存在的旧约束
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_daily_income'
  ) THEN
    ALTER TABLE daily_income DROP CONSTRAINT unique_daily_income;
  END IF;
  
  -- 添加新约束（仅date，注意：这会导致多用户场景下只能有一条记录）
  ALTER TABLE daily_income 
  ADD CONSTRAINT unique_daily_income UNIQUE (date);
END $$;

-- 2. 处理 product_sales 表的重复数据（保留最新的记录）
DELETE FROM product_sales
WHERE id NOT IN (
  SELECT DISTINCT ON (date, product_name) id
  FROM product_sales
  ORDER BY date, product_name, created_at DESC
);

-- 添加约束（按用户要求：date + product_name）
DO $$ 
BEGIN
  -- 先删除可能存在的旧约束
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_daily_product'
  ) THEN
    ALTER TABLE product_sales DROP CONSTRAINT unique_daily_product;
  END IF;
  
  -- 添加新约束（date + product_name）
  ALTER TABLE product_sales 
  ADD CONSTRAINT unique_daily_product UNIQUE (date, product_name);
END $$;

-- 注意：以上约束在多用户场景下可能存在问题
-- 如果后续需要支持多用户，建议改为：
-- daily_income: UNIQUE (user_id, date)
-- product_sales: UNIQUE (user_id, date, product_name)

