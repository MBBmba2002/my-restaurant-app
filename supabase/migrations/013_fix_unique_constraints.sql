-- 修复唯一约束，确保约束正确且处理重复数据

-- 1. 处理 daily_income 表的重复数据（保留最新的记录）
DELETE FROM daily_income
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, date) id
  FROM daily_income
  ORDER BY user_id, date, created_at DESC
);

-- 如果约束不存在，添加约束
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_daily_income'
  ) THEN
    ALTER TABLE daily_income 
    ADD CONSTRAINT unique_daily_income UNIQUE (user_id, date);
  END IF;
END $$;

-- 2. 处理 product_sales 表的重复数据（保留最新的记录）
DELETE FROM product_sales
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, date, product_name) id
  FROM product_sales
  ORDER BY user_id, date, product_name, created_at DESC
);

-- 如果约束不存在，添加约束
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_daily_product'
  ) THEN
    ALTER TABLE product_sales 
    ADD CONSTRAINT unique_daily_product UNIQUE (user_id, date, product_name);
  END IF;
END $$;

-- 3. 处理 daily_expenses 表的重复数据（保留最新的记录）
DELETE FROM daily_expenses
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id, date, category) id
  FROM daily_expenses
  ORDER BY user_id, date, category, created_at DESC
);

-- 如果约束不存在，添加约束
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_daily_expense'
  ) THEN
    ALTER TABLE daily_expenses 
    ADD CONSTRAINT unique_daily_expense UNIQUE (user_id, date, category);
  END IF;
END $$;

-- 4. 确保 daily_records 表有 is_locked 字段
ALTER TABLE daily_records 
ADD COLUMN IF NOT EXISTS is_locked boolean DEFAULT false;

-- 5. 确保 daily_records 表有唯一约束
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_user_date'
  ) THEN
    ALTER TABLE daily_records 
    ADD CONSTRAINT unique_user_date UNIQUE (user_id, record_date);
  END IF;
END $$;

