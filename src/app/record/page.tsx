"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { RequireAuth } from "@/components/auth/RequireAuth";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "material" | "fixed" | "equipment" | "other";
  onSubmit: (data: {
    expense_type: string;
    expense_amount: number;
    expense_item_name: string;
    usage_duration?: string;
  }) => void;
}

function ExpenseModal({ isOpen, onClose, type, onSubmit }: ExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [itemName, setItemName] = useState("");
  const [usageDuration, setUsageDuration] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("请输入有效的金额");
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {config.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 金额输入 */}
          <div>
            <label className="block text-lg font-medium mb-2 text-gray-700">
              金额（元）
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="请输入金额"
              className="w-full text-2xl p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 项目选择/输入 */}
          {config.items.length > 0 ? (
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                选择项目
              </label>
              <div className="grid grid-cols-2 gap-3">
                {config.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setItemName(item)}
                    className={`p-4 text-lg rounded-lg border-2 ${
                      itemName === item
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                项目名称
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
                placeholder="请输入项目名称"
                className="w-full text-xl p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* 使用时长（仅按钮3） */}
          {type === "equipment" && (
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                能用多久？
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setUsageDuration("days")}
                  className={`w-full p-4 text-xl rounded-lg border-2 ${
                    usageDuration === "days"
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
                >
                  用几天
                </button>
                <button
                  type="button"
                  onClick={() => setUsageDuration("months")}
                  className={`w-full p-4 text-xl rounded-lg border-2 ${
                    usageDuration === "months"
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
                >
                  用几个月
                </button>
                <button
                  type="button"
                  onClick={() => setUsageDuration("long_term")}
                  className={`w-full p-4 text-xl rounded-lg border-2 ${
                    usageDuration === "long_term"
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
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
              className="flex-1 p-4 text-xl bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 p-4 text-xl bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 销量输入组件（可复用）- 极简主义美化版
interface SkuInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function SkuInput({ label, value, onChange, disabled = false }: SkuInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newValue = e.target.value;
    setInputValue(newValue);
    const numValue = parseInt(newValue) || 0;
    if (numValue >= 0) {
      onChange(numValue);
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
      <label className="block text-base font-medium mb-3 text-gray-700">
        {label}
      </label>
      <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-xl p-3 shadow-sm">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled}
          className={`w-12 h-12 text-2xl font-bold bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-all ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-300 active:scale-95 active:bg-gray-400"
          }`}
        >
          -
        </button>
        <div className="flex-1 max-w-[90px]">
          <input
            type="number"
            min="0"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={() => {
              if (disabled) return;
              const numValue = parseInt(inputValue) || 0;
              onChange(Math.max(0, numValue));
            }}
            disabled={disabled}
            className={`w-full text-xl font-bold text-center py-3 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg transition-all ${
              disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
            }`}
          />
        </div>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled}
          className={`w-12 h-12 text-2xl font-bold bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-all ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-300 active:scale-95 active:bg-gray-400"
          }`}
        >
          +
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

  // 支出
  const [expenses, setExpenses] = useState<
    Array<{
      expense_type: string;
      expense_amount: number;
      expense_item_name: string;
      usage_duration?: string;
    }>
  >([]);

  // 模态框
  const [expenseModal, setExpenseModal] = useState<{
    isOpen: boolean;
    type: "material" | "fixed" | "equipment" | "other";
  }>({ isOpen: false, type: "material" });

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

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setTodayDate(`${year}年${month}月${day}日`);
  }, []);

  const handleExpenseSubmit = (data: {
    expense_type: string;
    expense_amount: number;
    expense_item_name: string;
    usage_duration?: string;
  }) => {
    setExpenses([...expenses, data]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("请先登录");
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
      alert("请至少输入一项数据");
      return;
    }

    // 有数据，显示确认对话框
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!user) {
      alert("请先登录");
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

      // 如果有收入或销量，创建一条记录
      if (totalIncome > 0 || hasSalesData) {
        const { error: recordError } = await supabase
          .from("daily_records")
          .insert({
            user_id: user.id,
            income_wechat: parseFloat(incomeWechat || "0"),
            income_alipay: parseFloat(incomeAlipay || "0"),
            income_cash: parseFloat(incomeCash || "0"),
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
          alert("保存失败：" + recordError.message);
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
          alert("保存支出失败：" + expenseError.message);
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
      setExpenses([]);
      setShowSuccess(true);

      // 3秒后隐藏成功提示
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error("Error:", err);
      alert("保存失败：" + (err.message || "未知错误"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white text-center py-4 text-xl z-50">
          ✅ 今天的收支记好了，今天辛苦了，明天再接再厉！
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4">
        {/* 顶部日期 */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-800">{todayDate}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 第一板块：今日收入 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-red-600">💰 今日收入</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xl font-medium mb-2 text-gray-700">
                  微信
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={incomeWechat}
                  onChange={(e) => {
                    if (!totalIncomeConfirmed) {
                      setIncomeWechat(e.target.value);
                      setIncomeSaved(false);
                    }
                  }}
                  placeholder="0.00"
                  disabled={totalIncomeConfirmed}
                  className={`w-full text-2xl p-4 border-2 rounded-lg focus:outline-none ${
                    totalIncomeConfirmed
                      ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                      : "border-red-300 focus:border-red-500"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xl font-medium mb-2 text-gray-700">
                  支付宝
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={incomeAlipay}
                  onChange={(e) => {
                    if (!totalIncomeConfirmed) {
                      setIncomeAlipay(e.target.value);
                      setIncomeSaved(false);
                    }
                  }}
                  placeholder="0.00"
                  disabled={totalIncomeConfirmed}
                  className={`w-full text-2xl p-4 border-2 rounded-lg focus:outline-none ${
                    totalIncomeConfirmed
                      ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                      : "border-red-300 focus:border-red-500"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xl font-medium mb-2 text-gray-700">
                  现金
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={incomeCash}
                  onChange={(e) => {
                    if (!totalIncomeConfirmed) {
                      setIncomeCash(e.target.value);
                      setIncomeSaved(false);
                    }
                  }}
                  placeholder="0.00"
                  disabled={totalIncomeConfirmed}
                  className={`w-full text-2xl p-4 border-2 rounded-lg focus:outline-none ${
                    totalIncomeConfirmed
                      ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                      : "border-red-300 focus:border-red-500"
                  }`}
                />
              </div>

              {/* 保存收入按钮 */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleSaveIncome}
                  disabled={totalIncomeConfirmed}
                  className={`w-full p-4 text-xl font-bold rounded-lg ${
                    totalIncomeConfirmed
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : incomeSavedMessage
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {incomeSavedMessage ? "✅ 已保存" : "💾 保存"}
                </button>
              </div>

              {/* 今日总收入显示 */}
              <div className="mt-4 pt-4 border-t-2 border-red-200">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-5 shadow-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="text-xl font-semibold text-gray-700">
                        今日总收入
                      </div>
                      {totalIncomeConfirmed && (
                        <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full">
                          已确认
                        </span>
                      )}
                    </div>
                    <div className="text-4xl font-bold text-red-600 mb-3">
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
                        className="px-6 py-3 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700"
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
          <div className={`space-y-4 ${totalIncomeConfirmed ? "opacity-60" : ""}`}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 当日产品销量追踪</h2>
            
            {/* 饼类产品卡片 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-amber-400 rounded-full mr-3"></div>
                <h3 className="text-lg font-bold text-gray-800">饼类产品</h3>
              </div>
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
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-6 bg-green-400 rounded-full mr-3"></div>
                    <h3 className="text-lg font-bold text-gray-800">汤/粥类</h3>
                  </div>
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
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-blue-400 rounded-full mr-3"></div>
                <h3 className="text-lg font-bold text-gray-800">米线/面类</h3>
              </div>

              {/* 【素】米线/面 */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-gray-700 mb-3 ml-4">【素】米线/面</h4>
                <div className="grid grid-cols-2 gap-4">
                  <SkuInput label="三鲜" value={skuMixianSuSanxian} onChange={setSkuMixianSuSanxian} disabled={totalIncomeConfirmed} />
                  <SkuInput label="酸菜" value={skuMixianSuSuancai} onChange={setSkuMixianSuSuancai} disabled={totalIncomeConfirmed} />
                  <SkuInput label="麻辣" value={skuMixianSuMala} onChange={setSkuMixianSuMala} disabled={totalIncomeConfirmed} />
                </div>
              </div>

              {/* 【肉】米线/面 */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-gray-700 mb-3 ml-4">【肉】米线/面</h4>
                <div className="grid grid-cols-2 gap-4">
                  <SkuInput label="三鲜" value={skuMixianRouSanxian} onChange={setSkuMixianRouSanxian} disabled={totalIncomeConfirmed} />
                  <SkuInput label="酸菜" value={skuMixianRouSuancai} onChange={setSkuMixianRouSuancai} disabled={totalIncomeConfirmed} />
                  <SkuInput label="麻辣" value={skuMixianRouMala} onChange={setSkuMixianRouMala} disabled={totalIncomeConfirmed} />
                </div>
              </div>

              {/* 酸辣粉 */}
              <div>
                <h4 className="text-base font-semibold text-gray-700 mb-3 ml-4">酸辣粉</h4>
                <div className="grid grid-cols-2 gap-4">
                  <SkuInput label="酸辣粉" value={skuSuanlafen} onChange={setSkuSuanlafen} disabled={totalIncomeConfirmed} />
                </div>
              </div>
            </div>

            {/* 炒面/炒河粉类产品卡片 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-green-400 rounded-full mr-3"></div>
                <h3 className="text-lg font-bold text-gray-800">炒面/炒河粉类</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SkuInput label="香脆炒面" value={skuChaomianXiangcui} onChange={setSkuChaomianXiangcui} disabled={totalIncomeConfirmed} />
                <SkuInput label="【宽粉】炒河粉" value={skuChaohufenKuan} onChange={setSkuChaohufenKuan} disabled={totalIncomeConfirmed} />
                <SkuInput label="【细粉】炒河粉" value={skuChaohufenXi} onChange={setSkuChaohufenXi} disabled={totalIncomeConfirmed} />
              </div>
            </div>
          </div>

          {/* 第三板块：支出按钮 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">💸 今日支出</h2>
            
            {/* 已添加的支出列表 */}
            {expenses.length > 0 && (
              <div className="mb-4 space-y-2">
                {expenses.map((exp, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-blue-50 rounded-lg"
                  >
                    <span className="text-lg">
                      {exp.expense_item_name} - ¥{exp.expense_amount}
                      {exp.usage_duration && (
                        <span className="text-sm text-gray-600 ml-2">
                          ({exp.usage_duration === "days" ? "用几天" : exp.usage_duration === "months" ? "用几个月" : "用很久"})
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newExpenses = [...expenses];
                        newExpenses.splice(idx, 1);
                        setExpenses(newExpenses);
                      }}
                      className="text-red-500 text-xl"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setExpenseModal({ isOpen: true, type: "material" })
                }
                className="p-6 text-xl bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold"
              >
                1️⃣ 买原材料
              </button>
              <button
                type="button"
                onClick={() =>
                  setExpenseModal({ isOpen: true, type: "fixed" })
                }
                className="p-6 text-xl bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold"
              >
                2️⃣ 交固定钱
              </button>
              <button
                type="button"
                onClick={() =>
                  setExpenseModal({ isOpen: true, type: "equipment" })
                }
                className="p-6 text-xl bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-bold"
              >
                3️⃣ 买店里用的
              </button>
              <button
                type="button"
                onClick={() =>
                  setExpenseModal({ isOpen: true, type: "other" })
                }
                className="p-6 text-xl bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-bold"
              >
                4️⃣ 其他
              </button>
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full p-6 text-2xl bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
      />

      {/* 提交前确认对话框 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              请再次检查
            </h2>
            <p className="text-xl text-center text-gray-600 mb-6">
              请再次检查是否当天数据都准确无误
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 p-4 text-xl bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                我再看看
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="flex-1 p-4 text-xl bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
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
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              确认提交今日总收入
            </h2>
            <p className="text-xl text-center text-red-600 mb-6 font-semibold">
              确认提交今日总收入，无法再修改
            </p>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-red-600">
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
                className="flex-1 p-4 text-xl bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                再想想
              </button>
              <button
                type="button"
                onClick={handleConfirmTotalIncome}
                className="flex-1 p-4 text-xl bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
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
