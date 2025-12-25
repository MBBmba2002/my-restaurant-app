"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { RequireAuth } from "@/components/auth/RequireAuth";


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

  return (
    <div className="flex flex-col">
      <label className="block text-base font-medium mb-3 text-[#3d3435]">
        {label}
      </label>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled}
          className={`w-8 h-8 bg-red-50 text-[#ab322a] rounded-full flex items-center justify-center transition-all border-none ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-red-100 active:scale-95"
          }`}
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
            onBlur={() => {
              if (disabled || useStringValue) return;
              const numValue = parseInt(inputValue) || 0;
              onChange(Math.max(0, numValue));
            }}
            disabled={disabled}
            className={`w-full font-mono text-2xl font-bold text-center py-4 bg-white border-none focus:outline-none focus:ring-1 focus:ring-[#ab322a] rounded-3xl transition-all text-[#0c0c0c] ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled}
          className={`w-8 h-8 bg-red-50 text-[#ab322a] rounded-full flex items-center justify-center transition-all border-none ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-red-100 active:scale-95"
          }`}
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
  const [expenses, setExpenses] = useState<any[]>([]);

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
  const [totalIncomeConfirmed, setTotalIncomeConfirmed] = useState(false);
  const [showTotalIncomeConfirmDialog, setShowTotalIncomeConfirmDialog] = useState(false);

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
                className="w-full font-mono text-2xl p-4 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c]"
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
                  className="w-full font-mono text-xl p-4 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c]"
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
                className="flex-1 p-4 text-xl bg-[#3d3435] text-[#f2eada] rounded-full transition-all active:scale-95"
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

  // 数值输入校验函数
  const handleNumberChange = (value: string, setter: (value: string) => void) => {
    // 使用正则表达式过滤非数字字符，仅保留数字和小数点
    const filteredValue = value.replace(/[^0-9.]/g, '');
    setter(filteredValue);
  };

  // 自动计算支出汇总
  const expenseTotals = useMemo(() => {
    const rawTotal = parseFloat(expRawVeg || "0") +
                     parseFloat(expRawMeat || "0") +
                     parseFloat(expRawEgg || "0") +
                     parseFloat(expRawNoodle || "0") +
                     parseFloat(expRawSpice || "0") +
                     parseFloat(expRawPack || "0");

    const fixTotal = parseFloat(expFixRent || "0") +
                     parseFloat(expFixUtility || "0") +
                     parseFloat(expFixGas || "0") +
                     parseFloat(expFixSalary || "0");

    const consTotal = parseFloat(expConsAmount || "0");

    const otherTotal = parseFloat(expOtherAmount || "0");

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
  }, []);

  const handleExpenseSubmit = (data: {
    expense_type: string;
    expense_amount: number;
    expense_item_name: string;
    usage_duration?: string;
  }) => {
    setExpenses([...expenses, data]);
  };

  // 处理支出模块确认提交
  const handleExpenseModuleSubmit = async (module: "raw" | "fixed" | "cons" | "other") => {
    if (!user) {
      showToast("请先登录", "error");
      router.push("/login/");
      return;
    }

    try {
      const expenseData: any = {
        user_id: user.id,
        record_date: new Date().toISOString().split('T')[0], // 今天的日期
      };

      // 根据模块类型设置不同的字段
      switch (module) {
        case "raw":
          expenseData.exp_raw_veg = parseFloat(expRawVeg || "0");
          expenseData.exp_raw_meat = parseFloat(expRawMeat || "0");
          expenseData.exp_raw_egg = parseFloat(expRawEgg || "0");
          expenseData.exp_raw_noodle = parseFloat(expRawNoodle || "0");
          expenseData.exp_raw_spice = parseFloat(expRawSpice || "0");
          expenseData.exp_raw_pack = parseFloat(expRawPack || "0");
          expenseData.total_expense_raw = expenseTotals.rawTotal;
          break;
        case "fixed":
          expenseData.exp_fix_rent = parseFloat(expFixRent || "0");
          expenseData.exp_fix_utility = parseFloat(expFixUtility || "0");
          expenseData.exp_fix_gas = parseFloat(expFixGas || "0");
          expenseData.exp_fix_salary = parseFloat(expFixSalary || "0");
          expenseData.total_expense_fix = expenseTotals.fixTotal;
          break;
        case "cons":
          expenseData.exp_cons_name = expConsName;
          expenseData.exp_cons_amount = parseFloat(expConsAmount || "0");
          expenseData.exp_cons_duration = expConsDuration;
          expenseData.total_expense_cons = expenseTotals.consTotal;
          break;
        case "other":
          expenseData.exp_other_name = expOtherName;
          expenseData.exp_other_amount = parseFloat(expOtherAmount || "0");
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

    } catch (err: any) {
      console.error("Error:", err);
      showToast("保存失败：" + (err.message || "未知错误"), "error");
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

  // 确认提交总收入
  const handleConfirmTotalIncome = () => {
    setTotalIncomeConfirmed(true);
    setShowTotalIncomeConfirmDialog(false);
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

    // 先检查是否有数据
    const totalIncome =
      parseFloat(incomeWechat || "0") +
      parseFloat(incomeAlipay || "0") +
      parseFloat(incomeCash || "0");

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
      // 计算总收入
      const totalIncome =
        parseFloat(incomeWechat || "0") +
        parseFloat(incomeAlipay || "0") +
        parseFloat(incomeCash || "0");

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

      // 如果有收入或销量，创建一条记录
      if (totalIncome > 0 || hasSalesData) {
        const { error: recordError } = await supabase
          .from("daily_records")
          .insert({
            user_id: user.id,
            income_wechat: parseFloat(incomeWechat || "0"),
            income_alipay: parseFloat(incomeAlipay || "0"),
            income_cash: parseFloat(incomeCash || "0"),
            // 汇总字段
            total_income: totalIncome,
            total_sales: totalSalesCount,
            total_expenses: expenseTotals.grandTotal,
            estimated_profit: estimatedProfit,
            cogs_today: cogsToday,
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
          });

        if (recordError) {
          console.error("Error inserting record:", recordError);
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
      setTotalIncomeConfirmed(true);

      // 3秒后隐藏成功提示
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error("Error:", err);
      showToast("保存失败：" + (err.message || "未知错误"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2eada] pb-20">
      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-4 text-xl z-50">
          ✅ 今天的收支记好了，今天辛苦了，明天再接再厉！
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4">
        {/* 顶部日期 */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-[#0c0c0c]">{todayDate}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 第一板块：今日收入 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border-none">
            <h2 className="text-2xl font-bold mb-6 tracking-tight text-[#0c0c0c]">💰 今日收入</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xl font-bold mb-3 text-[#0c0c0c]">
                  微信
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={incomeWechat}
                  onChange={(e) => {
                    if (!totalIncomeConfirmed) {
                      handleNumberChange(e.target.value, setIncomeWechat);
                      setIncomeSaved(false);
                    }
                  }}
                  placeholder="0.00"
                  disabled={totalIncomeConfirmed}
                  className={`w-full font-mono text-xl p-4 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c] ${
                    totalIncomeConfirmed
                      ? "bg-gray-100 cursor-not-allowed opacity-60"
                      : ""
                  }`}
                />
              </div>
              <div>
                <label className="block text-xl font-bold mb-3 text-[#0c0c0c]">
                  支付宝
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={incomeAlipay}
                  onChange={(e) => {
                    if (!totalIncomeConfirmed) {
                      handleNumberChange(e.target.value, setIncomeAlipay);
                      setIncomeSaved(false);
                    }
                  }}
                  placeholder="0.00"
                  disabled={totalIncomeConfirmed}
                  className={`w-full font-mono text-xl p-4 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c] ${
                    totalIncomeConfirmed
                      ? "bg-gray-100 cursor-not-allowed opacity-60"
                      : ""
                  }`}
                />
              </div>
              <div>
                <label className="block text-xl font-bold mb-3 text-[#0c0c0c]">
                  现金
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={incomeCash}
                  onChange={(e) => {
                    if (!totalIncomeConfirmed) {
                      handleNumberChange(e.target.value, setIncomeCash);
                      setIncomeSaved(false);
                    }
                  }}
                  placeholder="0.00"
                  disabled={totalIncomeConfirmed}
                  className={`w-full font-mono text-xl p-4 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c] ${
                    totalIncomeConfirmed
                      ? "bg-gray-100 cursor-not-allowed opacity-60"
                      : ""
                  }`}
                />
              </div>

              {/* 保存收入按钮 */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleSaveIncome}
                  disabled={totalIncomeConfirmed}
                  className={`w-full p-4 text-lg font-bold rounded-full transition-all active:scale-95 ${
                    totalIncomeConfirmed
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : incomeSavedMessage
                      ? "bg-green-500 text-[#f2eada]"
                      : "bg-[#3d3435] text-[#f2eada]"
                  }`}
                >
                  {incomeSavedMessage ? "✅ 已保存" : "💾 保存"}
                </button>
              </div>

              {/* 今日总收入显示 */}
              <div className="mt-6 pt-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="text-xl font-bold text-[#3d3435]">
                        今日总收入
                      </div>
                      {totalIncomeConfirmed && (
                        <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full">
                          已确认
                        </span>
                      )}
                    </div>
                    <div className="text-5xl font-bold text-[#0c0c0c] mb-6">
                      ¥ {(
                        parseFloat(incomeWechat || "0") +
                        parseFloat(incomeAlipay || "0") +
                        parseFloat(incomeCash || "0")
                      ).toFixed(2)}
                    </div>
                    {!totalIncomeConfirmed && (
                      <button
                        type="button"
                        onClick={() => setShowTotalIncomeConfirmDialog(true)}
                        className="px-8 py-4 bg-[#ab322a] text-[#f2eada] text-lg font-bold rounded-full transition-all active:scale-95"
                      >
                        🔒 确认提交总收入
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 第二板块：当日产品销量追踪 */}
          <div className={`space-y-6 ${totalIncomeConfirmed ? "opacity-60" : ""}`}>
            <h2 className="text-2xl font-bold mb-6 tracking-tight text-[#0c0c0c]">📊 当日产品销量追踪</h2>
            
            {/* 饼类产品卡片 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-none">
              <h3 className="text-xl font-bold text-[#0c0c0c] mb-6">饼类产品</h3>
              <div className="grid grid-cols-2 gap-4">
                <SkuInput label="肉饼" value={skuRoubing} onChange={setSkuRoubing} disabled={totalIncomeConfirmed} />
                <SkuInput label="瘦肉饼" value={skuShouroubing} onChange={setSkuShouroubing} disabled={totalIncomeConfirmed} />
                <SkuInput label="肠蛋饼" value={skuChangdanbing} onChange={setSkuChangdanbing} disabled={totalIncomeConfirmed} />
                <SkuInput label="肉蛋饼" value={skuRoudanbing} onChange={setSkuRoudanbing} disabled={totalIncomeConfirmed} />
                <SkuInput label="蛋饼" value={skuDanbing} onChange={setSkuDanbing} disabled={totalIncomeConfirmed} />
                <SkuInput label="肠饼" value={skuChangbing} onChange={setSkuChangbing} disabled={totalIncomeConfirmed} />
              </div>
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
                <div className="bg-white rounded-3xl p-6 shadow-sm border-none">
                  <h3 className="text-xl font-bold text-[#0c0c0c] mb-6">汤/粥类</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {soupItems.map((item) => (
                      <SkuInput
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        onChange={item.onChange}
                        disabled={totalIncomeConfirmed}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 米线/面类产品卡片 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-none">
              <h3 className="text-xl font-bold text-[#0c0c0c] mb-6">米线/面类</h3>

              {/* 【素】米线/面 */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-[#3d3435] mb-3">【素】米线/面</h4>
                <div className="grid grid-cols-2 gap-4">
                  <SkuInput label="三鲜" value={skuMixianSuSanxian} onChange={setSkuMixianSuSanxian} disabled={totalIncomeConfirmed} />
                  <SkuInput label="酸菜" value={skuMixianSuSuancai} onChange={setSkuMixianSuSuancai} disabled={totalIncomeConfirmed} />
                  <SkuInput label="麻辣" value={skuMixianSuMala} onChange={setSkuMixianSuMala} disabled={totalIncomeConfirmed} />
                </div>
              </div>

              {/* 【肉】米线/面 */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-[#3d3435] mb-3">【肉】米线/面</h4>
                <div className="grid grid-cols-2 gap-4">
                  <SkuInput label="三鲜" value={skuMixianRouSanxian} onChange={setSkuMixianRouSanxian} disabled={totalIncomeConfirmed} />
                  <SkuInput label="酸菜" value={skuMixianRouSuancai} onChange={setSkuMixianRouSuancai} disabled={totalIncomeConfirmed} />
                  <SkuInput label="麻辣" value={skuMixianRouMala} onChange={setSkuMixianRouMala} disabled={totalIncomeConfirmed} />
                </div>
              </div>

              {/* 酸辣粉 */}
              <div>
                <h4 className="text-base font-semibold text-[#3d3435] mb-3">酸辣粉</h4>
                <div className="grid grid-cols-2 gap-4">
                  <SkuInput label="酸辣粉" value={skuSuanlafen} onChange={setSkuSuanlafen} disabled={totalIncomeConfirmed} />
                </div>
              </div>
            </div>

            {/* 炒面/炒河粉类产品卡片 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-none">
              <h3 className="text-xl font-bold text-[#0c0c0c] mb-6">炒面/炒河粉类</h3>
              <div className="grid grid-cols-2 gap-4">
                <SkuInput label="香脆炒面" value={skuChaomianXiangcui} onChange={setSkuChaomianXiangcui} disabled={totalIncomeConfirmed} />
                <SkuInput label="【宽粉】炒河粉" value={skuChaohufenKuan} onChange={setSkuChaohufenKuan} disabled={totalIncomeConfirmed} />
                <SkuInput label="【细粉】炒河粉" value={skuChaohufenXi} onChange={setSkuChaohufenXi} disabled={totalIncomeConfirmed} />
              </div>
            </div>
          </div>

          {/* 第三板块：今日支出 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 tracking-tight text-[#0c0c0c]">💸 今日支出</h2>

            {/* 【购买原材料】模块 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-none">
              <h3 className="text-xl font-bold text-[#0c0c0c] mb-6">【购买原材料】</h3>
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
                        <div key={item.label} className="flex flex-col">
                          <label className="block text-sm font-medium mb-3 text-[#3d3435]">
                            {item.label}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.value}
                            onChange={(e) => item.onChange(e.target.value)}
                            disabled={expenseModulesLocked.raw}
                            placeholder="0.00"
                            className={`w-full font-mono text-xl p-3 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c] ${
                              expenseModulesLocked.raw
                                ? "bg-gray-100 cursor-not-allowed opacity-60"
                                : ""
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* 原材料汇总显示 */}
                    <div className="mt-6 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-[#3d3435]">本类合计：</span>
                        <span className="text-xl font-bold text-[#0c0c0c]">¥ {expenseTotals.rawTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {!expenseModulesLocked.raw && (
                      <button
                        type="button"
                        onClick={() => setExpenseConfirmModal({ isOpen: true, module: "raw" })}
                        className="w-full p-4 text-lg font-semibold bg-[#3d3435] text-[#f2eada] rounded-full transition-all active:scale-95"
                      >
                        🔒 记入支出
                      </button>
                    )}
                  </>
                );
              })()}
            </div>

            {/* 【门店固定费用】模块 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-none">
              <h3 className="text-xl font-bold text-[#0c0c0c] mb-6">【门店固定费用】</h3>
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
                        <div key={item.label} className="flex flex-col">
                          <label className="block text-sm font-medium mb-3 text-[#3d3435]">
                            {item.label}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.value}
                            onChange={(e) => item.onChange(e.target.value)}
                            disabled={expenseModulesLocked.fixed}
                            placeholder="0.00"
                            className={`w-full font-mono text-xl p-3 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c] ${
                              expenseModulesLocked.fixed
                                ? "bg-gray-100 cursor-not-allowed opacity-60"
                                : ""
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* 固定费用汇总显示 */}
                    <div className="mt-6 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-[#3d3435]">本类合计：</span>
                        <span className="text-xl font-bold text-[#0c0c0c]">¥ {expenseTotals.fixTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {!expenseModulesLocked.fixed && (
                      <button
                        type="button"
                        onClick={() => setExpenseConfirmModal({ isOpen: true, module: "fixed" })}
                        className="w-full p-4 text-lg font-semibold bg-[#3d3435] text-[#f2eada] rounded-full transition-all active:scale-95"
                      >
                        🔒 记入支出
                      </button>
                    )}
                  </>
                );
              })()}
            </div>

            {/* 【经营消耗品】模块 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border-none">
              <h3 className="text-xl font-bold text-[#0c0c0c] mb-6">【经营消耗品】</h3>
              {expenseModulesLocked.cons && (
                <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full mb-4 inline-block">
                  已锁定
                </span>
              )}

              {!expenseModulesLocked.cons && (
                <>
                  <div className="space-y-4 mb-4">
                    <div>
                      <label className="block text-base font-medium mb-2 text-[#3d3435]">
                        消耗品名称
                      </label>
                      <input
                        type="text"
                        value={expConsName}
                        onChange={(e) => setExpConsName(e.target.value)}
                        placeholder="请输入消耗品名称"
                        className="w-full font-mono text-xl p-3 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c]"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2 text-[#3d3435]">
                        金额（元）
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={expConsAmount}
                        onChange={(e) => handleNumberChange(e.target.value, setExpConsAmount)}
                        placeholder="0.00"
                        className="w-full font-mono text-xl p-3 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c]"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2 text-[#3d3435]">
                        能用多久？
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "1个月", label: "1个月" },
                          { value: "1-3个月", label: "1-3个月" },
                          { value: "6个月以上", label: "6个月以上" },
                          { value: "1年以上", label: "1年以上" },
                        ].map((duration) => (
                          <button
                            key={duration.value}
                            type="button"
                            onClick={() => setExpConsDuration(duration.value)}
                            className={`p-3 text-lg rounded-full transition-all ${
                              expConsDuration === duration.value
                                ? "bg-[#ab322a] text-[#f2eada]"
                                : "bg-white text-[#3d3435] hover:bg-red-50"
                            }`}
                          >
                            {duration.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 消耗品汇总显示 */}
                  <div className="mt-6 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-[#3d3435]">本类合计：</span>
                      <span className="text-xl font-bold text-[#0c0c0c]">¥ {expenseTotals.consTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpenseConfirmModal({ isOpen: true, module: "cons" })}
                    className="w-full p-4 text-lg font-semibold bg-[#3d3435] text-[#f2eada] rounded-full transition-all active:scale-95"
                  >
                    🔒 记入支出
                  </button>
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
            <div className="bg-white rounded-3xl p-6 shadow-sm border-none">
              <h3 className="text-xl font-bold text-[#0c0c0c] mb-6">【其他支出】</h3>
              {expenseModulesLocked.other && (
                <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full mb-4 inline-block">
                  已锁定
                </span>
              )}

              {!expenseModulesLocked.other && (
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-base font-medium mb-2 text-[#3d3435]">
                      支出项目名称
                    </label>
                    <input
                      type="text"
                      value={expOtherName}
                      onChange={(e) => setExpOtherName(e.target.value)}
                      placeholder="请输入支出项目名称"
                      className="w-full font-mono text-xl p-3 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c]"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-medium mb-2 text-[#3d3435]">
                      金额（元）
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={expOtherAmount}
                      onChange={(e) => handleNumberChange(e.target.value, setExpOtherAmount)}
                      placeholder="0.00"
                      className="w-full font-mono text-xl p-3 bg-white border-none rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#ab322a] transition-all text-[#0c0c0c]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpenseConfirmModal({ isOpen: true, module: "other" })}
                    className="w-full p-4 text-xl font-bold bg-[#3d3435] text-[#f2eada] rounded-full transition-all active:scale-95"
                  >
                    🔒 记入支出
                  </button>
                </div>
              )}

              {!expenseModulesLocked.other && (
                <>
                  <div className="space-y-4 mb-4">
                    <div>
                      <label className="block text-base font-medium mb-2 text-gray-700">
                        支出项目名称
                      </label>
                      <input
                        type="text"
                        value={expOtherName}
                        onChange={(e) => setExpOtherName(e.target.value)}
                        placeholder="请输入支出项目名称"
                        className="w-full text-xl p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2 text-gray-700">
                        金额（元）
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={expOtherAmount}
                        onChange={(e) => handleNumberChange(e.target.value, setExpOtherAmount)}
                        placeholder="0.00"
                        className="w-full text-xl p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                      />
                    </div>
                  </div>

                  {/* 其他支出汇总显示 */}
                  <div className="mt-4 pt-3 border-t-2 border-gray-200 bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-700">本类合计：</span>
                      <span className="text-xl font-bold text-gray-600">¥ {expenseTotals.otherTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpenseConfirmModal({ isOpen: true, module: "other" })}
                    className="w-full p-4 text-xl bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-bold"
                  >
                    🔒 记入支出
                  </button>
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

            {/* 当日总支出汇总看板 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border-none mb-6">
              <h3 className="text-xl font-bold text-[#0c0c0c] mb-6">💰 当日总支出</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#0c0c0c] mb-2">
                  ¥ {expenseTotals.grandTotal.toFixed(2)}
                </div>
                <div className="text-sm text-[#3d3435]">
                  包含所有支出分类汇总
                </div>
              </div>
            </div>

            {/* 今日经营成绩单 - 仅在最终确认后显示 */}
            {totalIncomeConfirmed && (
              <div className="bg-white rounded-3xl p-12 shadow-sm border-none">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#0c0c0c] mb-12">🏆 今日经营成绩单</h3>

                  {/* 核心指标 - 净利润 */}
                  <div className="mb-12">
                    <div className="text-lg font-medium text-[#3d3435] mb-4">今日预估净赚</div>
                    <div className="text-6xl font-bold text-[#ab322a]">
                      ¥ {((parseFloat(incomeWechat || "0") + parseFloat(incomeAlipay || "0") + parseFloat(incomeCash || "0")) - calculateTodayCOGS()).toFixed(2)}
                    </div>
                  </div>

                  {/* 辅助指标列表 */}
                  <div className="grid grid-cols-2 gap-6 text-left">
                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                      <div className="text-sm font-medium text-[#3d3435] mb-2">总收入</div>
                      <div className="text-xl font-bold text-[#0c0c0c]">
                        ¥ {(parseFloat(incomeWechat || "0") + parseFloat(incomeAlipay || "0") + parseFloat(incomeCash || "0")).toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                      <div className="text-sm font-medium text-[#3d3435] mb-2">总支出</div>
                      <div className="text-xl font-bold text-[#0c0c0c]">
                        ¥ {expenseTotals.grandTotal.toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                      <div className="text-sm font-medium text-[#3d3435] mb-2">经营成本</div>
                      <div className="text-lg font-bold text-[#0c0c0c]">
                        ¥ {calculateTodayCOGS().toFixed(2)}
                      </div>
                      <div className="text-xs text-[#3d3435] mt-1">含固定费摊销</div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                      <div className="text-sm font-medium text-[#3d3435] mb-2">销量汇总</div>
                      <div className="text-lg font-bold text-[#0c0c0c]">
                        {skuRoubing + skuShouroubing + skuChangdanbing + skuRoudanbing + skuDanbing + skuChangbing +
                         skuFentang + skuHundun + skuXiaomizhou + skuDoujiang + skuJidantang +
                         skuMixianSuSanxian + skuMixianSuSuancai + skuMixianSuMala +
                         skuMixianRouSanxian + skuMixianRouSuancai + skuMixianRouMala +
                         skuSuanlafen + skuChaomianXiangcui + skuChaohufenKuan + skuChaohufenXi} 个
                      </div>
                    </div>
                  </div>

                  {/* 鼓励语 */}
                  <div className="mt-12 pt-8">
                    <div className="text-sm text-[#3d3435]">
                      🎊 今日辛苦了！数据已保存，明天继续加油！
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full p-6 text-xl font-semibold bg-[#ab322a] text-[#f2eada] rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "保存中..." : "✅ 保存今天的记录"}
          </button>
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
      {expenseConfirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#0c0c0c]">
              确定记入吗？
            </h2>
            <p className="text-xl text-center text-[#ab322a] mb-6 font-semibold">
              提交后今日不可更改
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setExpenseConfirmModal({ isOpen: false, module: "raw" })}
                className="flex-1 p-4 text-xl bg-[#3d3435] text-[#f2eada] rounded-full transition-all active:scale-95 font-medium"
              >
                再想想
              </button>
              <button
                type="button"
                onClick={() => handleExpenseModuleSubmit(expenseConfirmModal.module)}
                className="flex-1 p-4 text-xl bg-[#ab322a] text-[#f2eada] rounded-full transition-all active:scale-95 font-medium"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast 通知组件 */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-full shadow-sm text-white ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-[#ab322a]' :
            'bg-[#3d3435]'
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* 提交前确认对话框 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#0c0c0c]">
              请再次检查
            </h2>
            <p className="text-xl text-center text-[#3d3435] mb-6">
              请再次检查是否当天数据都准确无误
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 p-4 text-xl bg-[#3d3435] text-[#f2eada] rounded-full transition-all active:scale-95 font-medium"
              >
                我再看看
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="flex-1 p-4 text-xl bg-[#ab322a] text-[#f2eada] rounded-full transition-all active:scale-95 font-medium"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 确认提交总收入对话框 */}
      {showTotalIncomeConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-center text-[#0c0c0c]">
              确认提交今日总收入
            </h2>
            <p className="text-xl text-center text-[#ab322a] mb-6 font-semibold">
              确认提交今日总收入，无法再修改
            </p>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-[#ab322a]">
                ¥ {(
                  parseFloat(incomeWechat || "0") +
                  parseFloat(incomeAlipay || "0") +
                  parseFloat(incomeCash || "0")
                ).toFixed(2)}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowTotalIncomeConfirmDialog(false)}
                className="flex-1 p-4 text-xl bg-[#3d3435] text-[#f2eada] rounded-full transition-all active:scale-95 font-medium"
              >
                再想想
              </button>
              <button
                type="button"
                onClick={handleConfirmTotalIncome}
                className="flex-1 p-4 text-xl bg-[#ab322a] text-[#f2eada] rounded-full transition-all active:scale-95 font-medium"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
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
