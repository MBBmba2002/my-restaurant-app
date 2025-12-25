# 数据库设置说明

## 创建 daily_records 表

本项目使用 Supabase PostgreSQL 数据库存储每日记账数据。

### 方法 1：通过 Supabase Dashboard（推荐）

1. **登录 Supabase Dashboard**
   - 访问：https://supabase.com/dashboard
   - 选择你的项目

2. **打开 SQL Editor**
   - 在左侧菜单中点击 **SQL Editor**
   - 点击 **New query**

3. **执行 SQL 脚本**
   - 打开项目中的文件：`supabase/migrations/001_create_daily_records.sql`
   - 复制全部内容
   - 粘贴到 SQL Editor 中
   - 点击 **Run** 或按 `Ctrl/Cmd + Enter` 执行

4. **验证表创建成功**
   - 在左侧菜单中点击 **Table Editor**
   - 应该能看到 `daily_records` 表
   - 检查表结构是否包含所有字段

### 方法 2：使用 Supabase CLI（可选）

如果你安装了 Supabase CLI，可以运行：

```bash
# 确保已经初始化 Supabase 项目（如果还没有）
supabase init

# 应用迁移
supabase db push
```

### 表结构说明

#### daily_records 表包含以下字段：

**基本信息：**
- `id` - 主键（UUID）
- `user_id` - 关联到登录用户（auth.users）
- `record_date` - 记录日期（默认为当天）
- `created_at` - 创建时间

**收入部分：**
- `income_wechat` - 微信收入
- `income_alipay` - 支付宝收入
- `income_cash` - 现金收入

**销量追踪（SKU）：**
- `sku_bing` - 饼类销量
- `sku_tang_su` - 汤类（素）销量
- `sku_mixian_su` - 米线（素）销量
- `sku_mixian_rou` - 米线（肉）销量
- `sku_chaomian` - 炒面/炒河粉销量

**支出部分：**
- `expense_type` - 支出类别（'material', 'fixed', 'equipment', 'other'）
- `expense_amount` - 支出金额
- `expense_item_name` - 支出项目名称（如：买肉、房租、锅铲）
- `usage_duration` - 使用时长（'days', 'months', 'long_term'）

**其他：**
- `note` - 备注

### 安全设置

表已启用 **Row Level Security (RLS)**，确保：
- 用户只能查看、插入、更新、删除自己的记录
- 不同用户的数据完全隔离
- 即使使用同一个数据库，数据也是私密的

### 索引优化

已创建以下索引以优化查询性能：
- `idx_records_user_date` - 按用户和日期查询
- `idx_records_record_date` - 按日期查询

### 常见问题

**Q: 如果表已经存在怎么办？**
A: 可以在 SQL Editor 中先执行 `DROP TABLE IF EXISTS daily_records CASCADE;` 然后再运行创建脚本，或者直接修改现有表结构。

**Q: 如何添加新的 SKU 字段？**
A: 在 SQL Editor 中执行：
```sql
ALTER TABLE daily_records ADD COLUMN sku_new_item integer DEFAULT 0;
```

**Q: 如何查看表结构？**
A: 在 Supabase Dashboard 中，进入 **Table Editor** → 选择 `daily_records` 表，可以看到所有字段和类型。





