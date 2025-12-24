-- 创建每日记账表
-- 用于记录每日收入、支出和销量

-- 1. 创建主账目表
CREATE TABLE daily_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL, -- 关联登录用户
  record_date date DEFAULT CURRENT_DATE,           -- 默认记录当天日期

  -- 【今日收入】
  income_wechat numeric(12, 2) DEFAULT 0,  -- 微信
  income_alipay numeric(12, 2) DEFAULT 0,  -- 支付宝
  income_cash numeric(12, 2) DEFAULT 0,    -- 现金

  -- 【销量追踪】(SKU) - 存储各产品的销售数量
  sku_bing integer DEFAULT 0,          -- 饼类
  sku_tang_su integer DEFAULT 0,       -- 汤类(素)
  sku_mixian_su integer DEFAULT 0,     -- 米线(素)
  sku_mixian_rou integer DEFAULT 0,    -- 米线(肉)
  sku_chaomian integer DEFAULT 0,      -- 炒面/炒河粉
  -- 其他细分SKU可以根据需要随时增加字段

  -- 【支出部分】 (对应四大按钮)
  -- 类别：'material'(原材料), 'fixed'(固定支出), 'equipment'(店里用的东西), 'other'(其他)
  expense_type text CHECK (expense_type IN ('material', 'fixed', 'equipment', 'other')), 
  expense_amount numeric(12, 2) DEFAULT 0,
  
  -- 具体是什么（如：买肉、房租、锅铲）
  expense_item_name text, 
  
  -- 使用时长（针对按钮3）：'days'(几天), 'months'(几个月), 'long_term'(很久)
  usage_duration text CHECK (usage_duration IN ('days', 'months', 'long_term')),

  note text, -- 备注
  created_at timestamp with time zone DEFAULT now()
);

-- 2. 开启行级安全 (RLS)，确保数据隐私
-- 这样即使用同一个数据库，不同的用户（比如爸和妈用不同账号）也只能看到自己录入的数据
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own records" ON daily_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own records" ON daily_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own records" ON daily_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own records" ON daily_records
  FOR DELETE USING (auth.uid() = user_id);

-- 3. 为查询优化添加索引（以后查报表会很快）
CREATE INDEX idx_records_user_date ON daily_records(user_id, record_date);
CREATE INDEX idx_records_record_date ON daily_records(record_date);

