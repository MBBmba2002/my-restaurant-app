"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FormRow } from "@/components/ui/FormRow";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { theme } from "@/lib/theme";
import { DailyRecord, ExpenseData, ExpenseModule, SalesModule } from "@/types/dailyRecords";


// 销量输入组件（可复用）- 极简主义美化版
interface SkuInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  useStringValue?: boolean; // 是否使用字符串值（用于数值输入校验）
  onStringChange?: (value: string) => void; // 字符串值变化回调
}

function SkuInput({ label, value, onChange, disabled = false, useStringValue = false, onStringChange }: SkuInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newValue = e.target.value;

    if (useStringValue && onStringChange) {
      // 字符串模式：只允许数字和小数点
      if (newValue === "" || /^\d*\.?\d*$/.test(newValue)) {
        setInputValue(newValue);
        onStringChange(newValue);
      }
    } else {
      // 数字模式：原有逻辑
      setInputValue(newValue);
      const numValue = parseInt(newValue) || 0;
      if (numValue >= 0) {
        onChange(numValue);
      }
    }
  };

  const handleDecrement = () => {
    if (disabled) return;
    onChange(Math.max(0, value - 1));
  };

  const handleIncrement = () => {
    if (disabled) return;
    onChange(value + 1);
  };

  const yellow = theme.accent.yellow;
  
  const handleBlur = () => {
    if (disabled || useStringValue) return;
    const numValue = parseInt(inputValue) || 0;
    onChange(Math.max(0, numValue));
  };
  
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium mb-2 text-[#4a4a4a]">
        {label}
      </label>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all border disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 active:scale-95"
          style={{
            backgroundColor: yellow.hover,
            color: yellow.base,
            borderColor: yellow.border,
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
          </svg>
        </button>
        <div className="flex-1 max-w-[160px]">
          <input
            type={useStringValue ? "text" : "number"}
            inputMode={useStringValue ? "decimal" : undefined}
            min="0"
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
            className="w-full font-mono text-xl font-bold text-center py-3 rounded-lg transition-all text-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none border"
            style={{
              backgroundColor: yellow.hover,
              borderColor: yellow.border,
            }}
            onFocus={(e) => {
              if (!disabled) {
                e.target.style.borderColor = yellow.base;
                e.target.style.boxShadow = `0 0 0 3px ${yellow.focus}`;
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = yellow.border;
              e.target.style.boxShadow = 'none';
              handleBlur();
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all border disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 active:scale-95"
          style={{
            backgroundColor: yellow.hover,
            color: yellow.base,
            borderColor: yellow.border,
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function RecordPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [todayDate, setTodayDate] = useState("");
  
  // 收入
  const [incomeWechat, setIncomeWechat] = useState("");
  const [incomeAlipay, setIncomeAlipay] = useState("");
  const [incomeCash, setIncomeCash] = useState("");

  // 销量状态 - 按产品分类定义
  // 饼类产品
  const [skuRoubing, setSkuRoubing] = useState(0);  // 肉饼
  const [skuShouroubing, setSkuShouroubing] = useState(0);  // 瘦肉饼
  const [skuChangdanbing, setSkuChangdanbing] = useState(0);  // 肠蛋饼
  const [skuRoudanbing, setSkuRoudanbing] = useState(0);  // 肉蛋饼
  const [skuDanbing, setSkuDanbing] = useState(0);  // 蛋饼
  const [skuChangbing, setSkuChangbing] = useState(0);  // 肠饼

  // 汤类(素)
  const [skuFentang, setSkuFentang] = useState(0);  // 粉汤
  const [skuHundun, setSkuHundun] = useState(0);  // 馄炖
  const [skuXiaomizhou, setSkuXiaomizhou] = useState(0);  // 小米粥
  const [skuDoujiang, setSkuDoujiang] = useState(0);  // 豆浆
  const [skuJidantang, setSkuJidantang] = useState(0);  // 鸡蛋汤

  // 【素】米线/面 - 精确分类
  const [skuMixianSuSanxian, setSkuMixianSuSanxian] = useState(0);     // 【素】米线三鲜
  const [skuMixianSuSuancai, setSkuMixianSuSuancai] = useState(0);     // 【素】米线酸菜
  const [skuMixianSuMala, setSkuMixianSuMala] = useState(0);           // 【素】米线麻辣

  // 【肉】米线/面 - 精确分类
  const [skuMixianRouSanxian, setSkuMixianRouSanxian] = useState(0);   // 【肉】米线三鲜
  const [skuMixianRouSuancai, setSkuMixianRouSuancai] = useState(0);   // 【肉】米线酸菜
  const [skuMixianRouMala, setSkuMixianRouMala] = useState(0);         // 【肉】米线麻辣

  // 酸辣粉
  const [skuSuanlafen, setSkuSuanlafen] = useState(0);                 // 酸辣粉

  // 炒面/炒河粉 - 精确分类
  const [skuChaomianXiangcui, setSkuChaomianXiangcui] = useState(0);    // 香脆炒面
  const [skuChaohufenKuan, setSkuChaohufenKuan] = useState(0);          // 【宽粉】炒河粉
  const [skuChaohufenXi, setSkuChaohufenXi] = useState(0);              // 【细粉】炒河粉

  // 保留旧字段用于兼容（如果需要）
  const [skuBing, setSkuBing] = useState(0);
  const [skuTangSu, setSkuTangSu] = useState(0);
  const [skuMixianSu, setSkuMixianSu] = useState(0);
  const [skuMixianRou, setSkuMixianRou] = useState(0);
  const [skuChaomian, setSkuChaomian] = useState(0);

  // 支出 - 四个模块的状态管理
  // 原材料支出
  const [expRawVeg, setExpRawVeg] = useState("");        // 蔬菜
  const [expRawMeat, setExpRawMeat] = useState("");       // 肉类
  const [expRawEgg, setExpRawEgg] = useState("");        // 鸡蛋
  const [expRawNoodle, setExpRawNoodle] = useState("");     // 粉/面
  const [expRawSpice, setExpRawSpice] = useState("");      // 调味品
  const [expRawPack, setExpRawPack] = useState("");       // 包装

  // 固定费用
  const [expFixRent, setExpFixRent] = useState("");       // 房租
  const [expFixUtility, setExpFixUtility] = useState("");    // 水电
  const [expFixGas, setExpFixGas] = useState("");        // 煤气
  const [expFixSalary, setExpFixSalary] = useState("");     // 工资

  // 消耗品
  const [expConsName, setExpConsName] = useState("");       // 消耗品名称
  const [expConsAmount, setExpConsAmount] = useState("");     // 消耗品金额
  const [expConsDuration, setExpConsDuration] = useState("");  // 使用时长

  // 其他支出
  const [expOtherName, setExpOtherName] = useState("");      // 其他支出名称
  const [expOtherAmount, setExpOtherAmount] = useState("");    // 其他支出金额

  // 支出
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);

  // 支出模态框
  const [expenseModal, setExpenseModal] = useState<{
    isOpen: boolean;
    type: "material" | "fixed" | "equipment" | "other";
  }>({ isOpen: false, type: "material" });

  // 支出模块锁定状态
  const [expenseModulesLocked, setExpenseModulesLocked] = useState({
    raw: false,      // 原材料
    fixed: false,    // 固定费用
    cons: false,     // 消耗品
    other: false     // 其他
  });

  // 支出确认Modal
  const [expenseConfirmModal, setExpenseConfirmModal] = useState<{
    isOpen: boolean;
    module: "raw" | "fixed" | "cons" | "other";
  }>({ isOpen: false, module: "raw" });

  // 成功提示
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // 提交前确认对话框
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  // 收入保存状态
  const [incomeSaved, setIncomeSaved] = useState(false);
  const [incomeSavedMessage, setIncomeSavedMessage] = useState(false);
  // 总收入确认提交状态
  const [isDayLocked, setIsDayLocked] = useState(false);
  const [showTotalIncomeConfirmDialog, setShowTotalIncomeConfirmDialog] = useState(false);

  // 销量模块保存状态
  const [salesModulesSaved, setSalesModulesSaved] = useState({
    bing: false,      // 饼类
    tang: false,      // 汤粥类
    mixian: false,    // 米线面类
    chaomian: false,  // 炒面河粉类
  });

  // Toast 通知状态
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'info' });

  // 显示 Toast 通知
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 4000); // 4秒后自动消失
  };

  // 支出模态框组件
  function ExpenseModal({ isOpen, onClose, type, onSubmit, onError }: {
    isOpen: boolean;
    onClose: () => void;
    type: "material" | "fixed" | "equipment" | "other";
    onSubmit: (data: {
      expense_type: string;
      expense_amount: number;
      expense_item_name: string;
      usage_duration?: string;
    }) => void;
    onError?: (message: string) => void;
  }) {
    const [amount, setAmount] = useState("");
    const [itemName, setItemName] = useState("");
    const [usageDuration, setUsageDuration] = useState<string>("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        if (onError) {
          onError("请输入有效的金额");
        }
        return;
      }

      onSubmit({
        expense_type: type,
        expense_amount: numAmount,
        expense_item_name: itemName,
        usage_duration: type === "equipment" ? usageDuration : undefined,
      });

      // 重置表单
      setAmount("");
      setItemName("");
      setUsageDuration("");
      onClose();
    };

    const getTypeConfig = () => {
      switch (type) {
        case "material":
          return {
            title: "买原材料",
            items: ["买菜", "肉", "蛋", "粉", "油调料"],
          };
        case "fixed":
          return {
            title: "交店里的固定钱",
            items: ["房租", "水电气", "工资", "其他"],
          };
        case "equipment":
          return {
            title: "买店里用的东西",
            items: [],
          };
        case "other":
          return {
            title: "其他支出",
            items: [],
          };
      }
    };

    const config = getTypeConfig();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#0c0c0c]">
            {config.title}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 金额输入 */}
            <div>
              <label className="block text-lg font-medium mb-2 text-[#3d3435]">
                金额（元）
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="请输入金额"
                className="w-full font-mono text-2xl p-4 bg-[#ab322a]/10 backdrop-blur-md border border-[#ab322a]/20 focus:outline-none focus:border-[#ab322a]/50 focus:shadow-[inset_0_0_0_1px_rgba(171,50,42,0.3)] rounded-3xl transition-all text-[#0c0c0c]"
              />
            </div>

            {/* 项目选择/输入 */}
            {config.items.length > 0 ? (
              <div>
                <label className="block text-lg font-medium mb-2 text-[#3d3435]">
                  选择项目
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {config.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setItemName(item)}
                      className={`p-4 text-lg rounded-full transition-all ${
                        itemName === item
                          ? "bg-[#ab322a] text-[#f2eada]"
                          : "bg-white text-[#3d3435] hover:bg-red-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-lg font-medium mb-2 text-[#3d3435]">
                  项目名称
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  placeholder="请输入项目名称"
                  className="w-full font-mono text-xl p-4 bg-[#ab322a]/10 backdrop-blur-md border border-[#ab322a]/20 focus:outline-none focus:border-[#ab322a]/50 focus:shadow-[inset_0_0_0_1px_rgba(171,50,42,0.3)] rounded-3xl transition-all text-[#0c0c0c]"
                />
              </div>
            )}

            {/* 使用时长（仅按钮3） */}
            {type === "equipment" && (
              <div>
                <label className="block text-lg font-medium mb-2 text-[#3d3435]">
                  能用多久？
                </label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setUsageDuration("days")}
                    className={`w-full p-4 text-xl rounded-full transition-all ${
                      usageDuration === "days"
                        ? "bg-[#ab322a] text-[#f2eada]"
                        : "bg-white text-[#3d3435] hover:bg-red-50"
                    }`}
                  >
                    用几天
                  </button>
                  <button
                    type="button"
                    onClick={() => setUsageDuration("months")}
                    className={`w-full p-4 text-xl rounded-full transition-all ${
                      usageDuration === "months"
                        ? "bg-[#ab322a] text-[#f2eada]"
                        : "bg-white text-[#3d3435] hover:bg-red-50"
                    }`}
                  >
                    用几个月
                  </button>
                  <button
                    type="button"
                    onClick={() => setUsageDuration("long_term")}
                    className={`w-full p-4 text-xl rounded-full transition-all ${
                      usageDuration === "long_term"
                        ? "bg-[#ab322a] text-[#f2eada]"
                        : "bg-white text-[#3d3435] hover:bg-red-50"
                    }`}
                  >
                    用很久
                  </button>
                </div>
              </div>
            )}

            {/* 按钮 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 p-4 text-xl bg-white border border-gray-200 text-[#0c0c0c] rounded-full transition-all active:scale-95"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 p-4 text-xl bg-[#ab322a] text-[#f2eada] rounded-full transition-all active:scale-95"
              >
                确认
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 数值输入校验函数 - 禁止负数，空值自动补0
  const handleNumberChange = (value: string, setter: (value: string) => void) => {
    // 使用正则表达式过滤非数字字符，仅保留数字和小数点
    let filteredValue = value.replace(/[^0-9.]/g, '');
    
    // 如果为空，设置为"0"
    if (filteredValue === '' || filteredValue === '.') {
      filteredValue = '0';
    }
    
    // 确保不会出现负数（前端校验）
    const numValue = parseFloat(filteredValue);
    if (numValue < 0) {
      filteredValue = '0';
    }
    
    setter(filteredValue);
  };
  
  // 安全的数值解析函数 - 确保非负数
  const parseNonNegativeNumber = (value: string | number | undefined, defaultValue: number = 0): number => {
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) || num < 0 ? defaultValue : num;
  };

  // 自动计算销量模块汇总
  const salesTotals = useMemo(() => {
    // 饼类总计
    const bingTotal = skuRoubing + skuShouroubing + skuChangdanbing + skuRoudanbing + skuDanbing + skuChangbing;
    
    // 汤粥类总计
    const tangTotal = skuFentang + skuHundun + skuXiaomizhou + skuDoujiang + skuJidantang;
    
    // 米线面类总计
    const mixianTotal = skuMixianSuSanxian + skuMixianSuSuancai + skuMixianSuMala +
                        skuMixianRouSanxian + skuMixianRouSuancai + skuMixianRouMala +
                        skuSuanlafen;
    
    // 炒面河粉类总计
    const chaomianTotal = skuChaomianXiangcui + skuChaohufenKuan + skuChaohufenXi;
    
    return {
      bingTotal,
      tangTotal,
      mixianTotal,
      chaomianTotal,
    };
  }, [
    skuRoubing, skuShouroubing, skuChangdanbing, skuRoudanbing, skuDanbing, skuChangbing,
    skuFentang, skuHundun, skuXiaomizhou, skuDoujiang, skuJidantang,
    skuMixianSuSanxian, skuMixianSuSuancai, skuMixianSuMala,
    skuMixianRouSanxian, skuMixianRouSuancai, skuMixianRouMala,
    skuSuanlafen,
    skuChaomianXiangcui, skuChaohufenKuan, skuChaohufenXi,
  ]);

  // 自动计算支出汇总 - 使用安全的数值解析
  const expenseTotals = useMemo(() => {
    const rawTotal = parseNonNegativeNumber(expRawVeg) +
                     parseNonNegativeNumber(expRawMeat) +
                     parseNonNegativeNumber(expRawEgg) +
                     parseNonNegativeNumber(expRawNoodle) +
                     parseNonNegativeNumber(expRawSpice) +
                     parseNonNegativeNumber(expRawPack);

    const fixTotal = parseNonNegativeNumber(expFixRent) +
                     parseNonNegativeNumber(expFixUtility) +
                     parseNonNegativeNumber(expFixGas) +
                     parseNonNegativeNumber(expFixSalary);

    const consTotal = parseNonNegativeNumber(expConsAmount);

    const otherTotal = parseNonNegativeNumber(expOtherAmount);

    const grandTotal = rawTotal + fixTotal + consTotal + otherTotal;

    return {
      rawTotal,
      fixTotal,
      consTotal,
      otherTotal,
      grandTotal
    };
  }, [expRawVeg, expRawMeat, expRawEgg, expRawNoodle, expRawSpice, expRawPack,
      expFixRent, expFixUtility, expFixGas, expFixSalary,
      expConsAmount, expOtherAmount]);

  // 全局汇总数据 - 用于总览弹窗
  const globalSummary = useMemo(() => {
    const totalIncome = parseNonNegativeNumber(incomeWechat) + 
                       parseNonNegativeNumber(incomeAlipay) + 
                       parseNonNegativeNumber(incomeCash);
    
    const totalSales = salesTotals.bingTotal + salesTotals.tangTotal + 
                      salesTotals.mixianTotal + salesTotals.chaomianTotal;
    
    return {
      income: {
        wechat: parseNonNegativeNumber(incomeWechat),
        alipay: parseNonNegativeNumber(incomeAlipay),
        cash: parseNonNegativeNumber(incomeCash),
        total: totalIncome,
      },
      sales: {
        bing: salesTotals.bingTotal,
        tang: salesTotals.tangTotal,
        mixian: salesTotals.mixianTotal,
        chaomian: salesTotals.chaomianTotal,
        total: totalSales,
      },
      expenses: {
        raw: expenseTotals.rawTotal,
        fixed: expenseTotals.fixTotal,
        cons: expenseTotals.consTotal,
        other: expenseTotals.otherTotal,
        total: expenseTotals.grandTotal,
      },
    };
  }, [incomeWechat, incomeAlipay, incomeCash, salesTotals, expenseTotals]);

  // 全局汇总弹窗状态
  const [showGlobalSummaryModal, setShowGlobalSummaryModal] = useState(false);
  const [globalSubmitting, setGlobalSubmitting] = useState(false);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setTodayDate(`${year}年${month}月${day}日`);

    // 从localStorage恢复支出模块锁定状态
    const savedExpenseLocks = localStorage.getItem("expense_modules_locked");
    if (savedExpenseLocks) {
      setExpenseModulesLocked(JSON.parse(savedExpenseLocks));
    }

    // 检查当日是否已锁定
    checkDayLockStatus();
  }, [user]);

  // 检查当日锁定状态
  const checkDayLockStatus = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from("daily_records")
        .select("is_locked")
        .eq("user_id", user.id)
        .eq("record_date", today)
        .single();

      if (!error && data) {
        setIsDayLocked(data.is_locked === true);
      }
    } catch (err) {
      console.error("Error checking lock status:", err);
    }
  };

  const handleExpenseSubmit = (data: {
    expense_type: string;
    expense_amount: number;
    expense_item_name: string;
    usage_duration?: string;
  }) => {
    setExpenses([...expenses, data]);
  };

  // 处理支出模块确认提交
  const handleExpenseModuleSubmit = async (module: ExpenseModule) => {
    if (!user) {
      showToast("请先登录", "error");
      router.push("/login/");
      return;
    }

    try {
      const expenseData: Partial<DailyRecord> = {
        user_id: user.id,
        record_date: new Date().toISOString().split('T')[0], // 今天的日期
      };

      // 根据模块类型设置不同的字段 - 使用安全的数值解析
      switch (module) {
        case "raw":
          expenseData.exp_raw_veg = parseNonNegativeNumber(expRawVeg);
          expenseData.exp_raw_meat = parseNonNegativeNumber(expRawMeat);
          expenseData.exp_raw_egg = parseNonNegativeNumber(expRawEgg);
          expenseData.exp_raw_noodle = parseNonNegativeNumber(expRawNoodle);
          expenseData.exp_raw_spice = parseNonNegativeNumber(expRawSpice);
          expenseData.exp_raw_pack = parseNonNegativeNumber(expRawPack);
          expenseData.total_expense_raw = expenseTotals.rawTotal;
          break;
        case "fixed":
          expenseData.exp_fix_rent = parseNonNegativeNumber(expFixRent);
          expenseData.exp_fix_utility = parseNonNegativeNumber(expFixUtility);
          expenseData.exp_fix_gas = parseNonNegativeNumber(expFixGas);
          expenseData.exp_fix_salary = parseNonNegativeNumber(expFixSalary);
          expenseData.total_expense_fix = expenseTotals.fixTotal;
          break;
        case "cons":
          expenseData.exp_cons_name = expConsName;
          expenseData.exp_cons_amount = parseNonNegativeNumber(expConsAmount);
          expenseData.exp_cons_duration = expConsDuration;
          expenseData.total_expense_cons = expenseTotals.consTotal;
          break;
        case "other":
          expenseData.exp_other_name = expOtherName;
          expenseData.exp_other_amount = parseNonNegativeNumber(expOtherAmount);
          expenseData.total_expense_other = expenseTotals.otherTotal;
          break;
      }

      // 更新当日总支出
      expenseData.total_daily_expense = expenseTotals.grandTotal;

      // 插入或更新支出记录
      const { error } = await supabase
        .from("daily_records")
        .upsert(expenseData, {
          onConflict: 'user_id,record_date',
          ignoreDuplicates: false
        });

      if (error) {
        console.error("Error saving expense:", error);
        showToast("保存支出失败：" + error.message, "error");
        return;
      }

      // 更新锁定状态并保存到localStorage
      const newLocks = { ...expenseModulesLocked, [module]: true };
      setExpenseModulesLocked(newLocks);
      localStorage.setItem("expense_modules_locked", JSON.stringify(newLocks));

      // 关闭确认Modal
      setExpenseConfirmModal({ isOpen: false, module: "raw" });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "未知错误";
      console.error("Error:", err);
      showToast("保存失败：" + errorMessage, "error");
    }
  };

  // 保存收入（临时保存到本地存储）
  const handleSaveIncome = () => {
    const incomeData = {
      wechat: incomeWechat,
      alipay: incomeAlipay,
      cash: incomeCash,
      timestamp: Date.now(),
    };
    localStorage.setItem("daily_income_temp", JSON.stringify(incomeData));
    setIncomeSaved(true);
    setIncomeSavedMessage(true);
    // 3秒后隐藏"已保存"提示
    setTimeout(() => {
      setIncomeSavedMessage(false);
    }, 3000);
  };

  // 处理销量模块局部保存
  const handleSaveSalesModule = async (module: SalesModule) => {
    if (!user) {
      showToast("请先登录", "error");
      return;
    }

    try {
      const salesData: Partial<DailyRecord> = {
        user_id: user.id,
        record_date: new Date().toISOString().split('T')[0],
      };

      // 根据模块类型设置不同的字段
      switch (module) {
        case "bing":
          salesData.sku_roubing = skuRoubing;
          salesData.sku_shouroubing = skuShouroubing;
          salesData.sku_changdanbing = skuChangdanbing;
          salesData.sku_roudanbing = skuRoudanbing;
          salesData.sku_danbing = skuDanbing;
          salesData.sku_changbing = skuChangbing;
          salesData.total_bing_count = salesTotals.bingTotal;
          break;
        case "tang":
          salesData.sku_fentang = skuFentang;
          salesData.sku_hundun = skuHundun;
          salesData.sku_mizhou = skuXiaomizhou;
          salesData.sku_doujiang = skuDoujiang;
          salesData.sku_jidantang = skuJidantang;
          salesData.total_tang_count = salesTotals.tangTotal;
          break;
        case "mixian":
          salesData.sku_mixian_su_sanxian = skuMixianSuSanxian;
          salesData.sku_mixian_su_suancai = skuMixianSuSuancai;
          salesData.sku_mixian_su_mala = skuMixianSuMala;
          salesData.sku_mixian_rou_sanxian = skuMixianRouSanxian;
          salesData.sku_mixian_rou_suancai = skuMixianRouSuancai;
          salesData.sku_mixian_rou_mala = skuMixianRouMala;
          salesData.sku_suanlafen = skuSuanlafen;
          salesData.total_mixian_count = salesTotals.mixianTotal;
          break;
        case "chaomian":
          salesData.sku_chaomian_xiangcui = skuChaomianXiangcui;
          salesData.sku_chaohefen_kuan = skuChaohufenKuan;
          salesData.sku_chaohefen_xi = skuChaohufenXi;
          salesData.total_chaomian_count = salesTotals.chaomianTotal;
          break;
      }

      // 插入或更新销量记录
      const { error } = await supabase
        .from("daily_records")
        .upsert(salesData, {
          onConflict: 'user_id,record_date',
          ignoreDuplicates: false
        });

      if (error) {
        console.error("Error saving sales:", error);
        showToast("保存销量失败：" + error.message, "error");
        return;
      }

      // 更新保存状态
      setSalesModulesSaved(prev => ({ ...prev, [module]: true }));
      showToast(`已保存${module === "bing" ? "饼类" : module === "tang" ? "汤粥类" : module === "mixian" ? "米线面类" : "炒面河粉类"}销量`, "success");

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "未知错误";
      console.error("Error:", err);
      showToast("保存失败：" + errorMessage, "error");
    }
  };

  // 确认提交总收入（已废弃，使用handleGlobalSave代替）
  const handleConfirmTotalIncome = () => {
    setIsDayLocked(true);
    setShowTotalIncomeConfirmDialog(false);
  };

  // 全局保存与锁定函数
  const handleGlobalSave = async () => {
    if (!user) {
      showToast("请先登录", "error");
      router.push("/login/");
      return;
    }

    setGlobalSubmitting(true);
    setShowGlobalSummaryModal(false);

    try {
      const today = new Date().toISOString().split('T')[0];
      const totalIncome = globalSummary.income.total;
      const totalSales = globalSummary.sales.total;
      const totalExpenses = globalSummary.expenses.total;
      const cogsToday = calculateTodayCOGS();
      const estimatedProfit = totalIncome - cogsToday;

      // 统一upsert所有数据到daily_records表
      const recordData: Partial<DailyRecord> = {
        user_id: user.id,
        record_date: today,
        // 收入字段
        income_wechat: globalSummary.income.wechat,
        income_alipay: globalSummary.income.alipay,
        income_cash: globalSummary.income.cash,
        total_income: totalIncome,
        // 销量字段 - 饼类
        sku_roubing: skuRoubing,
        sku_shouroubing: skuShouroubing,
        sku_changdanbing: skuChangdanbing,
        sku_roudanbing: skuRoudanbing,
        sku_danbing: skuDanbing,
        sku_changbing: skuChangbing,
        total_bing_count: salesTotals.bingTotal,
        // 销量字段 - 汤粥类
        sku_fentang: skuFentang,
        sku_hundun: skuHundun,
        sku_mizhou: skuXiaomizhou,
        sku_doujiang: skuDoujiang,
        sku_jidantang: skuJidantang,
        total_tang_count: salesTotals.tangTotal,
        // 销量字段 - 米线面类
        sku_mixian_su_sanxian: skuMixianSuSanxian,
        sku_mixian_su_suancai: skuMixianSuSuancai,
        sku_mixian_su_mala: skuMixianSuMala,
        sku_mixian_rou_sanxian: skuMixianRouSanxian,
        sku_mixian_rou_suancai: skuMixianRouSuancai,
        sku_mixian_rou_mala: skuMixianRouMala,
        sku_suanlafen: skuSuanlafen,
        total_mixian_count: salesTotals.mixianTotal,
        // 销量字段 - 炒面河粉类
        sku_chaomian_xiangcui: skuChaomianXiangcui,
        sku_chaohefen_kuan: skuChaohufenKuan,
        sku_chaohefen_xi: skuChaohufenXi,
        total_chaomian_count: salesTotals.chaomianTotal,
        total_sales: totalSales,
        // 支出字段 - 原材料
        exp_raw_veg: parseNonNegativeNumber(expRawVeg),
        exp_raw_meat: parseNonNegativeNumber(expRawMeat),
        exp_raw_egg: parseNonNegativeNumber(expRawEgg),
        exp_raw_noodle: parseNonNegativeNumber(expRawNoodle),
        exp_raw_spice: parseNonNegativeNumber(expRawSpice),
        exp_raw_pack: parseNonNegativeNumber(expRawPack),
        total_expense_raw: expenseTotals.rawTotal,
        // 支出字段 - 固定费用
        exp_fix_rent: parseNonNegativeNumber(expFixRent),
        exp_fix_utility: parseNonNegativeNumber(expFixUtility),
        exp_fix_gas: parseNonNegativeNumber(expFixGas),
        exp_fix_salary: parseNonNegativeNumber(expFixSalary),
        total_expense_fix: expenseTotals.fixTotal,
        // 支出字段 - 消耗品
        exp_cons_name: expConsName,
        exp_cons_amount: parseNonNegativeNumber(expConsAmount),
        exp_cons_duration: expConsDuration,
        total_expense_cons: expenseTotals.consTotal,
        // 支出字段 - 其他
        exp_other_name: expOtherName,
        exp_other_amount: parseNonNegativeNumber(expOtherAmount),
        total_expense_other: expenseTotals.otherTotal,
        // 支出汇总
        total_daily_expense: totalExpenses,
        total_expenses: totalExpenses,
        // 计算字段
        estimated_profit: estimatedProfit,
        cogs_today: cogsToday,
        // 锁定标志
        is_locked: true,
      };

      // 使用upsert一次性保存所有数据并锁定
      const { error: recordError } = await supabase
        .from("daily_records")
        .upsert(recordData, {
          onConflict: 'user_id,record_date',
          ignoreDuplicates: false
        });

      if (recordError) {
        console.error("Error saving global record:", recordError);
        showToast("保存失败：" + recordError.message, "error");
        setGlobalSubmitting(false);
        return;
      }

      // 更新锁定状态
      setIsDayLocked(true);
      
      // 显示成功提示
      showToast("✅ 今日数据已提交并锁定！", "success");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "未知错误";
      console.error("Error:", err);
      showToast("保存失败：" + errorMessage, "error");
    } finally {
      setGlobalSubmitting(false);
    }
  };

  // 计算今日经营成本 (COGS)
  const calculateTodayCOGS = () => {
    // 使用汇总数据：原材料总和 + 固定费用总和（按日分摊）
    return expenseTotals.rawTotal + (expenseTotals.fixTotal / 30); // 假设每月30天
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("请先登录", "error");
      router.push("/login/");
      return;
    }

    // 先检查是否有数据 - 使用安全的数值解析
    const totalIncome =
      parseNonNegativeNumber(incomeWechat) +
      parseNonNegativeNumber(incomeAlipay) +
      parseNonNegativeNumber(incomeCash);

    // 检查是否有销量数据
    const hasSalesData =
      skuRoubing > 0 || skuShouroubing > 0 || skuChangdanbing > 0 || skuRoudanbing > 0 || skuDanbing > 0 || skuChangbing > 0 ||
      skuFentang > 0 || skuHundun > 0 || skuXiaomizhou > 0 || skuDoujiang > 0 || skuJidantang > 0 ||
      skuMixianSuSanxian > 0 || skuMixianSuSuancai > 0 || skuMixianSuMala > 0 ||
      skuMixianRouSanxian > 0 || skuMixianRouSuancai > 0 || skuMixianRouMala > 0 ||
      skuSuanlafen > 0 ||
      skuChaomianXiangcui > 0 || skuChaohufenKuan > 0 || skuChaohufenXi > 0;

    // 如果没有任何数据，提示用户
    if (totalIncome === 0 && !hasSalesData && expenses.length === 0) {
      showToast("请至少输入一项数据", "error");
      return;
    }

    // 有数据，显示确认对话框
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!user) {
      showToast("请先登录", "error");
      router.push("/login/");
      return;
    }

    setShowConfirmDialog(false);
    setSubmitting(true);

    try {
      // 计算总收入 - 使用安全的数值解析
      const totalIncome =
        parseNonNegativeNumber(incomeWechat) +
        parseNonNegativeNumber(incomeAlipay) +
        parseNonNegativeNumber(incomeCash);

      // 检查是否有销量数据
      const hasSalesData =
        skuRoubing > 0 || skuShouroubing > 0 || skuChangdanbing > 0 || skuRoudanbing > 0 || skuDanbing > 0 || skuChangbing > 0 ||
        skuFentang > 0 || skuHundun > 0 || skuXiaomizhou > 0 || skuDoujiang > 0 || skuJidantang > 0 ||
        skuMixianSuSanxian > 0 || skuMixianSuSuancai > 0 || skuMixianSuMala > 0 ||
        skuMixianRouSanxian > 0 || skuMixianRouSuancai > 0 || skuMixianRouMala > 0 ||
        skuSuanlafen > 0 ||
        skuChaomianXiangcui > 0 || skuChaohufenKuan > 0 || skuChaohufenXi > 0;

      // 计算汇总数据
      const totalSalesCount =
        skuRoubing + skuShouroubing + skuChangdanbing + skuRoudanbing + skuDanbing + skuChangbing +
        skuFentang + skuHundun + skuXiaomizhou + skuDoujiang + skuJidantang +
        skuMixianSuSanxian + skuMixianSuSuancai + skuMixianSuMala +
        skuMixianRouSanxian + skuMixianRouSuancai + skuMixianRouMala +
        skuSuanlafen + skuChaomianXiangcui + skuChaohufenKuan + skuChaohufenXi;

      const cogsToday = calculateTodayCOGS();
      const estimatedProfit = totalIncome - cogsToday;

      // 如果有收入或销量，使用upsert创建或更新记录
      if (totalIncome > 0 || hasSalesData) {
        const recordData: Partial<DailyRecord> = {
          user_id: user.id,
          record_date: new Date().toISOString().split('T')[0],
          income_wechat: parseNonNegativeNumber(incomeWechat),
          income_alipay: parseNonNegativeNumber(incomeAlipay),
          income_cash: parseNonNegativeNumber(incomeCash),
            // 汇总字段
            total_income: totalIncome,
            total_sales: totalSalesCount,
            total_expenses: expenseTotals.grandTotal,
            estimated_profit: estimatedProfit,
            cogs_today: cogsToday,
            // 销量模块汇总字段
            total_bing_count: salesTotals.bingTotal,
            total_tang_count: salesTotals.tangTotal,
            total_mixian_count: salesTotals.mixianTotal,
            total_chaomian_count: salesTotals.chaomianTotal,
            // 饼类产品
            sku_roubing: skuRoubing,
            sku_shouroubing: skuShouroubing,
            sku_changdanbing: skuChangdanbing,
            sku_roudanbing: skuRoudanbing,
            sku_danbing: skuDanbing,
            sku_changbing: skuChangbing,
            // 汤类(素)
            sku_fentang: skuFentang,
            sku_hundun: skuHundun,
            sku_mizhou: skuXiaomizhou,  // 小米粥
            sku_doujiang: skuDoujiang,
            sku_jidantang: skuJidantang,
            // 【素】米线/面 - 精确分类
            sku_mixian_su_sanxian: skuMixianSuSanxian,
            sku_mixian_su_suancai: skuMixianSuSuancai,
            sku_mixian_su_mala: skuMixianSuMala,
            // 【肉】米线/面 - 精确分类
            sku_mixian_rou_sanxian: skuMixianRouSanxian,
            sku_mixian_rou_suancai: skuMixianRouSuancai,
            sku_mixian_rou_mala: skuMixianRouMala,
            // 酸辣粉
            sku_suanlafen: skuSuanlafen,
            // 炒面/炒河粉 - 精确分类
            sku_chaomian_xiangcui: skuChaomianXiangcui,
            sku_chaohefen_kuan: skuChaohufenKuan,
            sku_chaohefen_xi: skuChaohufenXi,
            // 兼容旧字段
            sku_bing: skuBing,
            sku_tang_su: skuTangSu,
            sku_mixian_su: skuMixianSu,
            sku_mixian_rou: skuMixianRou,
            sku_chaomian: skuChaomian,
          };

        // 使用upsert替代insert，确保按天更新
        const { error: recordError } = await supabase
          .from("daily_records")
          .upsert(recordData, {
            onConflict: 'user_id,record_date',
            ignoreDuplicates: false
          });

        if (recordError) {
          console.error("Error upserting record:", recordError);
          showToast("保存失败：" + recordError.message, "error");
          setSubmitting(false);
          return;
        }
      }

      // 为每条支出创建记录
      for (const expense of expenses) {
        const { error: expenseError } = await supabase
          .from("daily_records")
          .insert({
            user_id: user.id,
            expense_type: expense.expense_type,
            expense_amount: expense.expense_amount,
            expense_item_name: expense.expense_item_name,
            usage_duration: expense.usage_duration || null,
          });

        if (expenseError) {
          console.error("Error inserting expense:", expenseError);
          showToast("保存支出失败：" + expenseError.message, "error");
          setSubmitting(false);
          return;
        }
      }

      // 成功，清空表单
      setIncomeWechat("");
      setIncomeAlipay("");
      setIncomeCash("");
      // 清空所有销量
      setSkuRoubing(0); setSkuShouroubing(0); setSkuChangdanbing(0); setSkuRoudanbing(0); setSkuDanbing(0); setSkuChangbing(0);
      setSkuFentang(0); setSkuHundun(0); setSkuXiaomizhou(0); setSkuDoujiang(0); setSkuJidantang(0);
      setSkuMixianSuSanxian(0); setSkuMixianSuSuancai(0); setSkuMixianSuMala(0);
      setSkuMixianRouSanxian(0); setSkuMixianRouSuancai(0); setSkuMixianRouMala(0);
      setSkuSuanlafen(0);
      setSkuChaomianXiangcui(0); setSkuChaohufenKuan(0); setSkuChaohufenXi(0);
      setSkuBing(0); setSkuTangSu(0); setSkuMixianSu(0); setSkuMixianRou(0); setSkuChaomian(0);
      // 清空支出模块
      setExpRawVeg(""); setExpRawMeat(""); setExpRawEgg(""); setExpRawNoodle(""); setExpRawSpice(""); setExpRawPack("");
      setExpFixRent(""); setExpFixUtility(""); setExpFixGas(""); setExpFixSalary("");
      setExpConsName(""); setExpConsAmount(""); setExpConsDuration("");
      setExpOtherName(""); setExpOtherAmount("");
      // 重置锁定状态
      setExpenseModulesLocked({ raw: false, fixed: false, cons: false, other: false });
      localStorage.removeItem("expense_modules_locked");

      setExpenses([]);
      setShowSuccess(true);

      // 设置最终确认状态，显示经营成绩单
      setIsDayLocked(true);

      // 3秒后隐藏成功提示
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "未知错误";
      console.error("Error:", err);
      showToast("保存失败：" + errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#F5F3F0' }}>
      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-4 z-50" style={{ fontSize: '1rem' }}>
          ✅ 今天的收支记好了，今天辛苦了，明天再接再厉！
        </div>
      )}

      <div className="max-w-5xl mx-auto p-6">
        {/* 顶部日期 */}
        <div className="text-center py-8 mb-6">
          <h1 style={{ 
            fontSize: '1.875rem', // 30px
            fontWeight: 600,
            color: '#111827'
          }}>
            {todayDate}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 第一板块：今日收入 */}
          <Card accentColor="red">
            <SectionHeader title="💰 今日收入" accentColor="red" className="text-center mb-6" isPageTitle={false} />
            <div className="max-w-md mx-auto space-y-4">
              <FormRow label="微信" accentColor="red">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={incomeWechat}
                  onChange={(e) => {
                    if (!isDayLocked) {
                      handleNumberChange(e.target.value, setIncomeWechat);
                      setIncomeSaved(false);
                    }
                  }}
                  placeholder="0.00"
                  disabled={isDayLocked}
                  accentColor="red"
                />
              </FormRow>
              <FormRow label="支付宝" accentColor="red">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={incomeAlipay}
                  onChange={(e) => {
                    if (!isDayLocked) {
                      handleNumberChange(e.target.value, setIncomeAlipay);
                      setIncomeSaved(false);
                    }
                  }}
                  placeholder="0.00"
                  disabled={isDayLocked}
                  accentColor="red"
                />
              </FormRow>
              <FormRow label="现金" accentColor="red">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={incomeCash}
                  onChange={(e) => {
                    if (!isDayLocked) {
                      handleNumberChange(e.target.value, setIncomeCash);
                      setIncomeSaved(false);
                    }
                  }}
                  placeholder="0.00"
                  disabled={isDayLocked}
                  accentColor="red"
                />
              </FormRow>

              {/* 保存收入按钮 */}
              <div className="mt-4">
                <Button
                  type="button"
                  onClick={handleSaveIncome}
                  disabled={isDayLocked}
                  accentColor="red"
                  variant={incomeSavedMessage ? "primary" : "secondary"}
                  size="lg"
                  className="w-full"
                >
                  {incomeSavedMessage ? "✅ 已保存" : "💾 保存"}
                </Button>
              </div>

              {/* 今日总收入显示 - 视觉焦点 */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-sm font-medium text-[#4a4a4a] mb-3">
                    今日总收入
                    {isDayLocked && (
                      <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        已确认
                      </span>
                    )}
                  </div>
                  <StatCard
                    label=""
                    value={`¥ ${(parseNonNegativeNumber(incomeWechat) + parseNonNegativeNumber(incomeAlipay) + parseNonNegativeNumber(incomeCash)).toFixed(2)}`}
                    accentColor="red"
                    className="mt-4"
                  />
                  {!isDayLocked && (
                    <Button
                      type="button"
                      onClick={() => setShowTotalIncomeConfirmDialog(true)}
                      accentColor="red"
                      variant="primary"
                      size="lg"
                      className="mt-6 w-full"
                    >
                      🔒 确认提交总收入
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* 第二板块：当日产品销量追踪 */}
          <div className={`${isDayLocked ? "opacity-60" : ""}`}>
            <Card accentColor="yellow">
              <SectionHeader title="📊 当日产品销量追踪" accentColor="yellow" className="text-center mb-6" isPageTitle={false} />
              <div className="max-w-md mx-auto space-y-6">
            
            {/* 饼类产品卡片 */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 text-center">饼类产品</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <SkuInput label="肉饼" value={skuRoubing} onChange={setSkuRoubing} disabled={isDayLocked || salesModulesSaved.bing} />
                <SkuInput label="瘦肉饼" value={skuShouroubing} onChange={setSkuShouroubing} disabled={isDayLocked || salesModulesSaved.bing} />
                <SkuInput label="肠蛋饼" value={skuChangdanbing} onChange={setSkuChangdanbing} disabled={isDayLocked || salesModulesSaved.bing} />
                <SkuInput label="肉蛋饼" value={skuRoudanbing} onChange={setSkuRoudanbing} disabled={isDayLocked || salesModulesSaved.bing} />
                <SkuInput label="蛋饼" value={skuDanbing} onChange={setSkuDanbing} disabled={isDayLocked || salesModulesSaved.bing} />
                <SkuInput label="肠饼" value={skuChangbing} onChange={setSkuChangbing} disabled={isDayLocked || salesModulesSaved.bing} />
              </div>
              
              {/* 汇总显示 - 视觉焦点 */}
              <StatCard
                label="饼类总计"
                value={salesTotals.bingTotal}
                unit="个"
                accentColor="yellow"
                className="mb-4"
              />

              {/* 保存按钮 */}
              {!salesModulesSaved.bing && !isDayLocked && (
                <Button
                  type="button"
                  onClick={() => handleSaveSalesModule("bing")}
                  accentColor="yellow"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  保存饼类销量
                </Button>
              )}
              {salesModulesSaved.bing && (
                <div className="w-full p-4 text-center text-sm bg-green-500/10 text-green-700 rounded-lg">
                  ✓ 已保存
                </div>
              )}
            </div>

            {/* 汤粥类产品卡片 */}
            {(() => {
              const soupItems = [
                { label: "粉汤", value: skuFentang, onChange: setSkuFentang },
                { label: "馄炖", value: skuHundun, onChange: setSkuHundun },
                { label: "小米粥", value: skuXiaomizhou, onChange: setSkuXiaomizhou },
                { label: "豆浆", value: skuDoujiang, onChange: setSkuDoujiang },
                { label: "鸡蛋汤", value: skuJidantang, onChange: setSkuJidantang },
              ];

              return (
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 text-center">汤/粥类</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {soupItems.map((item) => (
                      <SkuInput
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        onChange={item.onChange}
                        disabled={isDayLocked || salesModulesSaved.tang}
                      />
                    ))}
                  </div>
                  
                  {/* 汇总显示 - 视觉焦点 */}
                  <StatCard
                    label="汤/粥类总计"
                    value={salesTotals.tangTotal}
                    unit="个"
                    accentColor="yellow"
                    className="mb-4"
                  />

                  {/* 保存按钮 */}
                  {!salesModulesSaved.tang && !isDayLocked && (
                    <Button
                      type="button"
                      onClick={() => handleSaveSalesModule("tang")}
                      accentColor="yellow"
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      保存汤/粥类销量
                    </Button>
                  )}
                  {salesModulesSaved.tang && (
                    <div className="w-full p-4 text-center text-sm bg-green-500/10 text-green-700 rounded-lg">
                      ✓ 已保存
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 米线/面类产品卡片 */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 text-center">米线/面类</h3>

              {/* 【素】米线/面 */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-[#4a4a4a] mb-3">【素】米线/面</h4>
                <div className="grid grid-cols-2 gap-4">
                  <SkuInput label="三鲜" value={skuMixianSuSanxian} onChange={setSkuMixianSuSanxian} disabled={isDayLocked || salesModulesSaved.mixian} />
                  <SkuInput label="酸菜" value={skuMixianSuSuancai} onChange={setSkuMixianSuSuancai} disabled={isDayLocked || salesModulesSaved.mixian} />
                  <SkuInput label="麻辣" value={skuMixianSuMala} onChange={setSkuMixianSuMala} disabled={isDayLocked || salesModulesSaved.mixian} />
                </div>
              </div>

              {/* 【肉】米线/面 */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-[#4a4a4a] mb-3">【肉】米线/面</h4>
                <div className="grid grid-cols-2 gap-4">
                  <SkuInput label="三鲜" value={skuMixianRouSanxian} onChange={setSkuMixianRouSanxian} disabled={isDayLocked || salesModulesSaved.mixian} />
                  <SkuInput label="酸菜" value={skuMixianRouSuancai} onChange={setSkuMixianRouSuancai} disabled={isDayLocked || salesModulesSaved.mixian} />
                  <SkuInput label="麻辣" value={skuMixianRouMala} onChange={setSkuMixianRouMala} disabled={isDayLocked || salesModulesSaved.mixian} />
                </div>
              </div>

              {/* 酸辣粉 */}
              <div className="mb-4">
                <h4 className="text-base font-semibold text-[#4a4a4a] mb-3">酸辣粉</h4>
                <div className="grid grid-cols-2 gap-4">
                  <SkuInput label="酸辣粉" value={skuSuanlafen} onChange={setSkuSuanlafen} disabled={isDayLocked || salesModulesSaved.mixian} />
                </div>
              </div>

              {/* 汇总显示 - 视觉焦点 */}
              <StatCard
                label="米线/面类总计"
                value={salesTotals.mixianTotal}
                unit="个"
                accentColor="yellow"
                className="mb-4"
              />

              {/* 保存按钮 */}
              {!salesModulesSaved.mixian && !isDayLocked && (
                <Button
                  type="button"
                  onClick={() => handleSaveSalesModule("mixian")}
                  accentColor="yellow"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  保存米线/面类销量
                </Button>
              )}
              {salesModulesSaved.mixian && (
                <div className="w-full p-4 text-center text-sm bg-green-500/10 text-green-700 rounded-lg">
                  ✓ 已保存
                </div>
              )}
            </div>

            {/* 炒面/炒河粉类产品卡片 */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 text-center">炒面/炒河粉类</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <SkuInput label="香脆炒面" value={skuChaomianXiangcui} onChange={setSkuChaomianXiangcui} disabled={isDayLocked || salesModulesSaved.chaomian} />
                <SkuInput label="【宽粉】炒河粉" value={skuChaohufenKuan} onChange={setSkuChaohufenKuan} disabled={isDayLocked || salesModulesSaved.chaomian} />
                <SkuInput label="【细粉】炒河粉" value={skuChaohufenXi} onChange={setSkuChaohufenXi} disabled={isDayLocked || salesModulesSaved.chaomian} />
              </div>
              
              {/* 汇总显示 - 视觉焦点 */}
              <StatCard
                label="炒面/炒河粉类总计"
                value={salesTotals.chaomianTotal}
                unit="个"
                accentColor="yellow"
                className="mb-4"
              />

              {/* 保存按钮 */}
              {!salesModulesSaved.chaomian && !isDayLocked && (
                <Button
                  type="button"
                  onClick={() => handleSaveSalesModule("chaomian")}
                  accentColor="yellow"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  保存炒面/炒河粉类销量
                </Button>
              )}
              {salesModulesSaved.chaomian && (
                <div className="w-full p-4 text-center text-sm bg-green-500/10 text-green-700 rounded-lg">
                  ✓ 已保存
                </div>
              )}
            </div>
              </div>
            </Card>
          </div>

          {/* 第三板块：今日支出 */}
          <Card accentColor="blue">
            <SectionHeader title="💸 今日支出" accentColor="blue" className="text-center mb-6" isPageTitle={false} />
            <div className="max-w-md mx-auto space-y-6">

            {/* 【购买原材料】模块 */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 text-center">【购买原材料】</h3>
                {expenseModulesLocked.raw && (
                  <span className="ml-2 text-sm bg-green-500 text-white px-3 py-1 rounded-full">
                    已锁定
                  </span>
                )}

              {(() => {
                const rawItems = [
                  { label: "蔬菜", value: expRawVeg, onChange: setExpRawVeg },
                  { label: "肉类", value: expRawMeat, onChange: setExpRawMeat },
                  { label: "鸡蛋", value: expRawEgg, onChange: setExpRawEgg },
                  { label: "粉/面", value: expRawNoodle, onChange: setExpRawNoodle },
                  { label: "调味品", value: expRawSpice, onChange: setExpRawSpice },
                  { label: "包装", value: expRawPack, onChange: setExpRawPack },
                ];

                return (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {rawItems.map((item) => (
                        <FormRow key={item.label} label={item.label} accentColor="blue">
                          <Input
                            type="number"
                            step="0.01"
                            value={item.value}
                            onChange={(e) => item.onChange(e.target.value)}
                            disabled={expenseModulesLocked.raw}
                            placeholder="0.00"
                            accentColor="blue"
                          />
                        </FormRow>
                      ))}
                    </div>

                    {/* 原材料汇总显示 - 视觉焦点 */}
                    <StatCard
                      label="本类合计"
                      value={`¥ ${expenseTotals.rawTotal.toFixed(2)}`}
                      accentColor="blue"
                      className="mt-6"
                    />

                    {!expenseModulesLocked.raw && (
                      <Button
                        type="button"
                        onClick={() => setExpenseConfirmModal({ isOpen: true, module: "raw" })}
                        accentColor="blue"
                        variant="primary"
                        size="lg"
                        className="w-full mt-4"
                      >
                        🔒 记入支出
                      </Button>
                    )}
                  </>
                );
              })()}
            </div>

            {/* 【门店固定费用】模块 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 text-center">【门店固定费用】</h3>
              {expenseModulesLocked.fixed && (
                <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full mb-4 inline-block">
                  已锁定
                </span>
              )}

              {(() => {
                const fixedItems = [
                  { label: "房租", value: expFixRent, onChange: setExpFixRent },
                  { label: "水电", value: expFixUtility, onChange: setExpFixUtility },
                  { label: "煤气", value: expFixGas, onChange: setExpFixGas },
                  { label: "工资", value: expFixSalary, onChange: setExpFixSalary },
                ];

                return (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {fixedItems.map((item) => (
                        <FormRow key={item.label} label={item.label} accentColor="blue">
                          <Input
                            type="number"
                            step="0.01"
                            value={item.value}
                            onChange={(e) => item.onChange(e.target.value)}
                            disabled={expenseModulesLocked.fixed}
                            placeholder="0.00"
                            accentColor="blue"
                          />
                        </FormRow>
                      ))}
                    </div>

                    {/* 固定费用汇总显示 - 视觉焦点 */}
                    <StatCard
                      label="本类合计"
                      value={`¥ ${expenseTotals.fixTotal.toFixed(2)}`}
                      accentColor="blue"
                      className="mt-6"
                    />

                    {!expenseModulesLocked.fixed && (
                      <Button
                        type="button"
                        onClick={() => setExpenseConfirmModal({ isOpen: true, module: "fixed" })}
                        accentColor="blue"
                        variant="primary"
                        size="lg"
                        className="w-full mt-4"
                      >
                        🔒 记入支出
                      </Button>
                    )}
                  </>
                );
              })()}
            </div>

            {/* 【经营消耗品】模块 */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 text-center">【经营消耗品】</h3>
              {expenseModulesLocked.cons && (
                <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full mb-4 inline-block">
                  已锁定
                </span>
              )}

              {!expenseModulesLocked.cons && (
                <>
                  <div className="space-y-4 mb-4">
                    <FormRow label="消耗品名称" accentColor="blue">
                      <Input
                        type="text"
                        value={expConsName}
                        onChange={(e) => setExpConsName(e.target.value)}
                        placeholder="请输入消耗品名称"
                        accentColor="blue"
                      />
                    </FormRow>

                    <FormRow label="金额（元）" accentColor="blue">
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={expConsAmount}
                        onChange={(e) => handleNumberChange(e.target.value, setExpConsAmount)}
                        placeholder="0.00"
                        accentColor="blue"
                      />
                    </FormRow>

                    <FormRow label="能用多久？" accentColor="blue">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "1个月", label: "1个月" },
                          { value: "1-3个月", label: "1-3个月" },
                          { value: "6个月以上", label: "6个月以上" },
                          { value: "1年以上", label: "1年以上" },
                        ].map((duration) => (
                          <Button
                            key={duration.value}
                            type="button"
                            onClick={() => setExpConsDuration(duration.value)}
                            accentColor="blue"
                            variant={expConsDuration === duration.value ? "primary" : "secondary"}
                            size="sm"
                            className="w-full"
                          >
                            {duration.label}
                          </Button>
                        ))}
                      </div>
                    </FormRow>
                  </div>

                  {/* 消耗品汇总显示 - 视觉焦点 */}
                  <StatCard
                    label="本类合计"
                    value={`¥ ${expenseTotals.consTotal.toFixed(2)}`}
                    accentColor="blue"
                    className="mt-6"
                  />

                  <Button
                    type="button"
                    onClick={() => setExpenseConfirmModal({ isOpen: true, module: "cons" })}
                    accentColor="blue"
                    variant="primary"
                    size="lg"
                    className="w-full mt-4"
                  >
                    🔒 记入支出
                  </Button>
                </>
              )}

              {expenseModulesLocked.cons && (
                <div className="p-4 bg-white rounded-3xl shadow-sm">
                  <div className="text-lg font-medium text-[#0c0c0c]">
                    {expConsName} - ¥{expConsAmount}
                  </div>
                  <div className="text-sm text-[#3d3435] mt-1">
                    使用时长：{expConsDuration}
                  </div>
                  {/* 消耗品汇总显示 */}
                  <div className="mt-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#3d3435]">本类合计：</span>
                      <span className="text-lg font-bold text-[#0c0c0c]">¥ {expenseTotals.consTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 【其他支出】模块 */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4 text-center">【其他支出】</h3>
              {expenseModulesLocked.other && (
                <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full mb-4 inline-block">
                  已锁定
                </span>
              )}

              {!expenseModulesLocked.other && (
                <>
                  <div className="space-y-4 mb-4">
                    <FormRow label="支出项目名称" accentColor="blue">
                      <Input
                        type="text"
                        value={expOtherName}
                        onChange={(e) => setExpOtherName(e.target.value)}
                        placeholder="请输入支出项目名称"
                        accentColor="blue"
                      />
                    </FormRow>

                    <FormRow label="金额（元）" accentColor="blue">
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={expOtherAmount}
                        onChange={(e) => handleNumberChange(e.target.value, setExpOtherAmount)}
                        placeholder="0.00"
                        accentColor="blue"
                      />
                    </FormRow>
                  </div>

                  {/* 其他支出汇总显示 - 视觉焦点 */}
                  <StatCard
                    label="本类合计"
                    value={`¥ ${expenseTotals.otherTotal.toFixed(2)}`}
                    accentColor="blue"
                    className="mt-6"
                  />

                  <Button
                    type="button"
                    onClick={() => setExpenseConfirmModal({ isOpen: true, module: "other" })}
                    accentColor="blue"
                    variant="primary"
                    size="lg"
                    className="w-full mt-4"
                  >
                    🔒 记入支出
                  </Button>
                </>
              )}

              {expenseModulesLocked.other && (
                <div className="p-4 bg-white rounded-3xl shadow-sm">
                  <div className="text-lg font-medium text-[#0c0c0c]">
                    {expOtherName} - ¥{expOtherAmount}
                  </div>
                  {/* 其他支出汇总显示 */}
                  <div className="mt-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#3d3435]">本类合计：</span>
                      <span className="text-lg font-bold text-[#0c0c0c]">¥ {expenseTotals.otherTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 当日总支出汇总看板 - 视觉焦点 */}
            <StatCard
              label="💰 当日总支出"
              value={`¥ ${expenseTotals.grandTotal.toFixed(2)}`}
              accentColor="blue"
              className="mt-6"
            />
            </div>
          </Card>

          {/* 今日经营成绩单 - 仅在最终确认后显示 */}
          {isDayLocked && (
            <Card accentColor="red" className="p-12">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-12">🏆 今日经营成绩单</h3>

                {/* 核心指标 - 净利润 */}
                <div className="mb-12">
                  <div className="text-lg font-medium text-[#4a4a4a] mb-4">今日预估净赚</div>
                  <div className="text-6xl font-bold" style={{ color: theme.accent.red.base }}>
                    ¥ {((parseNonNegativeNumber(incomeWechat) + parseNonNegativeNumber(incomeAlipay) + parseNonNegativeNumber(incomeCash)) - calculateTodayCOGS()).toFixed(2)}
                  </div>
                </div>

                {/* 辅助指标列表 */}
                <div className="grid grid-cols-2 gap-6 text-left">
                  <Card>
                    <div className="text-sm font-medium text-[#4a4a4a] mb-2">总收入</div>
                    <div className="text-xl font-bold text-[#1a1a1a]">
                      ¥ {(parseNonNegativeNumber(incomeWechat) + parseNonNegativeNumber(incomeAlipay) + parseNonNegativeNumber(incomeCash)).toFixed(2)}
                    </div>
                  </Card>

                  <Card>
                    <div className="text-sm font-medium text-[#4a4a4a] mb-2">总支出</div>
                    <div className="text-xl font-bold text-[#1a1a1a]">
                      ¥ {expenseTotals.grandTotal.toFixed(2)}
                    </div>
                  </Card>

                  <Card>
                    <div className="text-sm font-medium text-[#4a4a4a] mb-2">经营成本</div>
                    <div className="text-lg font-bold text-[#1a1a1a]">
                      ¥ {calculateTodayCOGS().toFixed(2)}
                    </div>
                    <div className="text-xs text-[#8a8a8a] mt-1">含固定费摊销</div>
                  </Card>

                  <Card>
                    <div className="text-sm font-medium text-[#4a4a4a] mb-2">销量汇总</div>
                    <div className="text-lg font-bold text-[#1a1a1a]">
                      {skuRoubing + skuShouroubing + skuChangdanbing + skuRoudanbing + skuDanbing + skuChangbing +
                       skuFentang + skuHundun + skuXiaomizhou + skuDoujiang + skuJidantang +
                       skuMixianSuSanxian + skuMixianSuSuancai + skuMixianSuMala +
                       skuMixianRouSanxian + skuMixianRouSuancai + skuMixianRouMala +
                       skuSuanlafen + skuChaomianXiangcui + skuChaohufenKuan + skuChaohufenXi} 个
                    </div>
                  </Card>
                </div>

                {/* 鼓励语 */}
                <div className="mt-12 pt-8">
                  <div className="text-sm text-[#4a4a4a]">
                    🎊 今日辛苦了！数据已保存，明天继续加油！
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 全局保存与锁定按钮 */}
          {!isDayLocked && (
            <Card accentColor="red" className="mt-6">
              <div className="text-center">
                <Button
                  type="button"
                  onClick={() => setShowGlobalSummaryModal(true)}
                  disabled={globalSubmitting || submitting}
                  accentColor="red"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  {globalSubmitting ? "提交中..." : "🔒 确认提交今日录入并锁定"}
                </Button>
                <p className="text-xs mt-2" style={{ color: theme.text.tertiary }}>
                  提交后将锁定今日所有数据，无法再修改
                </p>
              </div>
            </Card>
          )}

          {/* 锁定提示 */}
          {isDayLocked && (
            <Card accentColor="red" className="mt-6">
              <div className="text-center py-4">
                <div className="text-lg font-semibold mb-2" style={{ color: theme.accent.red.base }}>
                  🔒 今日账目已锁定
                </div>
                <p className="text-sm" style={{ color: theme.text.secondary }}>
                  今日数据已提交并锁定，无法修改
                </p>
              </div>
            </Card>
          )}

          {/* 旧提交按钮（保留作为备用） */}
          {!isDayLocked && (
            <Button
              type="submit"
              disabled={submitting}
              accentColor="red"
              variant="secondary"
              size="md"
              className="w-full mt-4"
            >
              {submitting ? "保存中..." : "💾 临时保存（不锁定）"}
            </Button>
          )}
        </form>
      </div>

      {/* 支出模态框 */}
      <ExpenseModal
        isOpen={expenseModal.isOpen}
        onClose={() => setExpenseModal({ isOpen: false, type: "material" })}
        type={expenseModal.type}
        onSubmit={handleExpenseSubmit}
        onError={(message) => showToast(message, "error")}
      />

      {/* 支出确认Modal */}
      <Modal
        isOpen={expenseConfirmModal.isOpen}
        onClose={() => setExpenseConfirmModal({ isOpen: false, module: "raw" })}
        title="确定记入吗？"
        accentColor="blue"
        showCloseButton={false}
      >
        <p className="text-lg text-center mb-6" style={{ color: theme.accent.red.base }}>
          提交后今日不可更改
        </p>
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => setExpenseConfirmModal({ isOpen: false, module: "raw" })}
            accentColor="blue"
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            再想想
          </Button>
          <Button
            type="button"
            onClick={() => handleExpenseModuleSubmit(expenseConfirmModal.module)}
            accentColor="red"
            variant="primary"
            size="lg"
            className="flex-1"
          >
            确定
          </Button>
        </div>
      </Modal>

      {/* Toast 通知组件 */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      {/* 提交前确认对话框 */}
      <Modal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        title="请再次检查"
        accentColor="red"
        showCloseButton={false}
      >
        <p className="text-lg text-center mb-6 text-[#4a4a4a]">
          请再次检查是否当天数据都准确无误
        </p>
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => setShowConfirmDialog(false)}
            accentColor="red"
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            我再看看
          </Button>
          <Button
            type="button"
            onClick={handleConfirmSubmit}
            accentColor="red"
            variant="primary"
            size="lg"
            className="flex-1"
          >
            确认提交
          </Button>
        </div>
      </Modal>

      {/* 确认提交总收入对话框 */}
      <Modal
        isOpen={showTotalIncomeConfirmDialog}
        onClose={() => setShowTotalIncomeConfirmDialog(false)}
        title="确认提交今日总收入"
        accentColor="red"
        showCloseButton={false}
      >
        <p className="text-lg text-center mb-6" style={{ color: theme.accent.red.base }}>
          确认提交今日总收入，无法再修改
        </p>
        <div className="text-center mb-6">
          <div className="text-3xl font-bold" style={{ color: theme.accent.red.base }}>
            ¥ {(
              parseNonNegativeNumber(incomeWechat) +
              parseNonNegativeNumber(incomeAlipay) +
              parseNonNegativeNumber(incomeCash)
            ).toFixed(2)}
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => setShowTotalIncomeConfirmDialog(false)}
            accentColor="red"
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            再想想
          </Button>
          <Button
            type="button"
            onClick={handleConfirmTotalIncome}
            accentColor="red"
            variant="primary"
            size="lg"
            className="flex-1"
          >
            确认
          </Button>
        </div>
      </Modal>

      {/* 全局汇总总览弹窗 */}
      <Modal
        isOpen={showGlobalSummaryModal}
        onClose={() => setShowGlobalSummaryModal(false)}
        title="📊 今日录入总览"
        accentColor="red"
        showCloseButton={true}
      >
        <div className="space-y-4">
          {/* 收入汇总 */}
          <Card accentColor="red">
            <div className="text-sm font-medium mb-3" style={{ color: theme.accent.red.base }}>
              收入汇总
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>微信：</span>
                <span className="font-mono font-semibold">¥ {globalSummary.income.wechat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>支付宝：</span>
                <span className="font-mono font-semibold">¥ {globalSummary.income.alipay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>现金：</span>
                <span className="font-mono font-semibold">¥ {globalSummary.income.cash.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t" style={{ borderColor: theme.accent.red.border }}>
                <span className="font-medium">总收入：</span>
                <span className="font-mono font-bold text-lg" style={{ color: theme.accent.red.base }}>
                  ¥ {globalSummary.income.total.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* 销量汇总 */}
          <Card accentColor="yellow">
            <div className="text-sm font-medium mb-3" style={{ color: theme.accent.yellow.base }}>
              销量汇总
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>饼类：</span>
                <span className="font-mono font-semibold">{globalSummary.sales.bing} 个</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>汤粥类：</span>
                <span className="font-mono font-semibold">{globalSummary.sales.tang} 个</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>米线面类：</span>
                <span className="font-mono font-semibold">{globalSummary.sales.mixian} 个</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>炒面河粉类：</span>
                <span className="font-mono font-semibold">{globalSummary.sales.chaomian} 个</span>
              </div>
              <div className="flex justify-between pt-2 border-t" style={{ borderColor: theme.accent.yellow.border }}>
                <span className="font-medium">总销量：</span>
                <span className="font-mono font-bold text-lg" style={{ color: theme.accent.yellow.base }}>
                  {globalSummary.sales.total} 个
                </span>
              </div>
            </div>
          </Card>

          {/* 支出汇总 */}
          <Card accentColor="blue">
            <div className="text-sm font-medium mb-3" style={{ color: theme.accent.blue.base }}>
              支出汇总
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>原材料：</span>
                <span className="font-mono font-semibold">¥ {globalSummary.expenses.raw.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>固定费用：</span>
                <span className="font-mono font-semibold">¥ {globalSummary.expenses.fixed.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>消耗品：</span>
                <span className="font-mono font-semibold">¥ {globalSummary.expenses.cons.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.text.secondary }}>其他：</span>
                <span className="font-mono font-semibold">¥ {globalSummary.expenses.other.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t" style={{ borderColor: theme.accent.blue.border }}>
                <span className="font-medium">总支出：</span>
                <span className="font-mono font-bold text-lg" style={{ color: theme.accent.blue.base }}>
                  ¥ {globalSummary.expenses.total.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* 警告提示 */}
          <div className="p-3 rounded-lg" style={{ backgroundColor: theme.accent.red.hover }}>
            <p className="text-sm text-center" style={{ color: theme.accent.red.base }}>
              ⚠️ 提交后将锁定今日所有数据，无法再修改
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              onClick={() => setShowGlobalSummaryModal(false)}
              accentColor="red"
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              再检查
            </Button>
            <Button
              type="button"
              onClick={handleGlobalSave}
              disabled={globalSubmitting}
              accentColor="red"
              variant="primary"
              size="lg"
              className="flex-1"
            >
              {globalSubmitting ? "提交中..." : "确认提交并锁定"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function RecordPage() {
  return (
    <RequireAuth>
      <RecordPageContent />
    </RequireAuth>
  );
}
