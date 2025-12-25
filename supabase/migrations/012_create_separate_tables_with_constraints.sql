-- 创建分离的表结构并添加UNIQUE约束
-- 为了更好的数据组织和约束管理

-- 1. 创建 daily_income 表
CREATE TABLE IF NOT EXISTS daily_income (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  date date NOT NULL,
  income_wechat numeric(12, 2) DEFAULT 0,
  income_alipay numeric(12, 2) DEFAULT 0,
  income_cash numeric(12, 2) DEFAULT 0,
  total_income numeric(12, 2) DEFAULT 0,
  is_locked boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT unique_daily_income UNIQUE (user_id, date)
);

-- 2. 创建 product_sales 表
CREATE TABLE IF NOT EXISTS product_sales (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  date date NOT NULL,
  product_name text NOT NULL,
  quantity integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT unique_daily_product UNIQUE (user_id, date, product_name)
);

-- 3. 创建 daily_expenses 表
CREATE TABLE IF NOT EXISTS daily_expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  date date NOT NULL,
  category text NOT NULL CHECK (category IN ('raw', 'fixed', 'cons', 'other')),
  amount numeric(12, 2) DEFAULT 0,
  item_name text,
  duration text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT unique_daily_expense UNIQUE (user_id, date, category)
);

-- 4. 为 daily_records 表添加 is_locked 字段（如果不存在）
ALTER TABLE daily_records 
ADD COLUMN IF NOT EXISTS is_locked boolean DEFAULT false;

-- 5. 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_daily_income_user_date ON daily_income(user_id, date);
CREATE INDEX IF NOT EXISTS idx_product_sales_user_date ON product_sales(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_expenses_user_date ON daily_expenses(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_records_locked ON daily_records(user_id, record_date, is_locked);

-- 6. 开启行级安全 (RLS)
ALTER TABLE daily_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_expenses ENABLE ROW LEVEL SECURITY;

-- 7. 创建RLS策略
CREATE POLICY "Users can manage their own income" ON daily_income
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sales" ON product_sales
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own expenses" ON daily_expenses
  FOR ALL USING (auth.uid() = user_id);

