// 每日记录相关的TypeScript类型定义

export interface DailyRecord {
  id?: string;
  user_id: string;
  record_date: string; // ISO date string: YYYY-MM-DD
  
  // 收入字段
  income_wechat?: number;
  income_alipay?: number;
  income_cash?: number;
  total_income?: number;
  
  // 销量字段 - 饼类
  sku_roubing?: number;
  sku_shouroubing?: number;
  sku_changdanbing?: number;
  sku_roudanbing?: number;
  sku_danbing?: number;
  sku_changbing?: number;
  
  // 销量字段 - 汤粥类
  sku_fentang?: number;
  sku_hundun?: number;
  sku_mizhou?: number;
  sku_doujiang?: number;
  sku_jidantang?: number;
  
  // 销量字段 - 米线面类
  sku_mixian_su_sanxian?: number;
  sku_mixian_su_suancai?: number;
  sku_mixian_su_mala?: number;
  sku_mixian_rou_sanxian?: number;
  sku_mixian_rou_suancai?: number;
  sku_mixian_rou_mala?: number;
  sku_suanlafen?: number;
  
  // 销量字段 - 炒面河粉类
  sku_chaomian_xiangcui?: number;
  sku_chaohefen_kuan?: number;
  sku_chaohefen_xi?: number;
  
  // 销量汇总字段
  total_bing_count?: number;
  total_tang_count?: number;
  total_mixian_count?: number;
  total_chaomian_count?: number;
  total_sales?: number;
  
  // 支出字段 - 原材料
  exp_raw_veg?: number;
  exp_raw_meat?: number;
  exp_raw_egg?: number;
  exp_raw_noodle?: number;
  exp_raw_spice?: number;
  exp_raw_pack?: number;
  total_expense_raw?: number;
  
  // 支出字段 - 固定费用
  exp_fix_rent?: number;
  exp_fix_utility?: number;
  exp_fix_gas?: number;
  exp_fix_salary?: number;
  total_expense_fix?: number;
  
  // 支出字段 - 消耗品
  exp_cons_name?: string;
  exp_cons_amount?: number;
  exp_cons_duration?: string;
  total_expense_cons?: number;
  
  // 支出字段 - 其他
  exp_other_name?: string;
  exp_other_amount?: number;
  total_expense_other?: number;
  
  // 支出汇总
  total_daily_expense?: number;
  total_expenses?: number;
  
  // 计算字段
  estimated_profit?: number;
  cogs_today?: number;
  
  // 锁定字段
  is_locked?: boolean;
  
  // 兼容旧字段
  sku_bing?: number;
  sku_tang_su?: number;
  sku_mixian_su?: number;
  sku_mixian_rou?: number;
  sku_chaomian?: number;
  expense_type?: string;
  expense_amount?: number;
  expense_item_name?: string;
  usage_duration?: string;
  
  created_at?: string;
}

export interface ExpenseData {
  expense_type: string;
  expense_amount: number;
  expense_item_name: string;
  usage_duration?: string;
}

export type ExpenseModule = "raw" | "fixed" | "cons" | "other";
export type SalesModule = "bing" | "tang" | "mixian" | "chaomian";

