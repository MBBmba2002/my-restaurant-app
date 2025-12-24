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

function RecordPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [todayDate, setTodayDate] = useState("");
  
  // 收入
  const [incomeWechat, setIncomeWechat] = useState("");
  const [incomeAlipay, setIncomeAlipay] = useState("");
  const [incomeCash, setIncomeCash] = useState("");

  // 销量
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

    // 如果没有任何数据，提示用户
    if (
      totalIncome === 0 &&
      skuBing === 0 &&
      skuTangSu === 0 &&
      skuMixianSu === 0 &&
      skuMixianRou === 0 &&
      skuChaomian === 0 &&
      expenses.length === 0
    ) {
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

      // 如果有收入或销量，创建一条记录
      if (totalIncome > 0 || skuBing > 0 || skuTangSu > 0 || skuMixianSu > 0 || skuMixianRou > 0 || skuChaomian > 0) {
        const { error: recordError } = await supabase
          .from("daily_records")
          .insert({
            user_id: user.id,
            income_wechat: parseFloat(incomeWechat || "0"),
            income_alipay: parseFloat(incomeAlipay || "0"),
            income_cash: parseFloat(incomeCash || "0"),
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
      setSkuBing(0);
      setSkuTangSu(0);
      setSkuMixianSu(0);
      setSkuMixianRou(0);
      setSkuChaomian(0);
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

      <div className="max-w-2xl mx-auto p-4">
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
                  onChange={(e) => setIncomeWechat(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-2xl p-4 border-2 border-red-300 rounded-lg focus:outline-none focus:border-red-500"
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
                  onChange={(e) => setIncomeAlipay(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-2xl p-4 border-2 border-red-300 rounded-lg focus:outline-none focus:border-red-500"
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
                  onChange={(e) => setIncomeCash(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-2xl p-4 border-2 border-red-300 rounded-lg focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* 第二板块：销量追踪 */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-orange-600">📊 销量追踪</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xl font-medium mb-2 text-gray-700">
                  饼类
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSkuBing(Math.max(0, skuBing - 1))}
                    className="w-12 h-12 text-2xl bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold min-w-[60px] text-center">
                    {skuBing}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSkuBing(skuBing + 1)}
                    className="w-12 h-12 text-2xl bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xl font-medium mb-2 text-gray-700">
                  汤类(素)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSkuTangSu(Math.max(0, skuTangSu - 1))}
                    className="w-12 h-12 text-2xl bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold min-w-[60px] text-center">
                    {skuTangSu}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSkuTangSu(skuTangSu + 1)}
                    className="w-12 h-12 text-2xl bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xl font-medium mb-2 text-gray-700">
                  米线(素)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSkuMixianSu(Math.max(0, skuMixianSu - 1))}
                    className="w-12 h-12 text-2xl bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold min-w-[60px] text-center">
                    {skuMixianSu}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSkuMixianSu(skuMixianSu + 1)}
                    className="w-12 h-12 text-2xl bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xl font-medium mb-2 text-gray-700">
                  米线(肉)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSkuMixianRou(Math.max(0, skuMixianRou - 1))}
                    className="w-12 h-12 text-2xl bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold min-w-[60px] text-center">
                    {skuMixianRou}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSkuMixianRou(skuMixianRou + 1)}
                    className="w-12 h-12 text-2xl bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xl font-medium mb-2 text-gray-700">
                  炒面/炒河粉
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSkuChaomian(Math.max(0, skuChaomian - 1))}
                    className="w-12 h-12 text-2xl bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold min-w-[60px] text-center">
                    {skuChaomian}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSkuChaomian(skuChaomian + 1)}
                    className="w-12 h-12 text-2xl bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                  >
                    +
                  </button>
                </div>
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

