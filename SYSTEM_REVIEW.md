# 系统现状报告

## 1. 核心逻辑：数据流向与按天更新机制

| 模块 | 数据流向 | 按天更新逻辑 | 状态 |
|------|---------|-------------|------|
| **收入模块** | 前端输入 → `handleSaveIncome()` (仅localStorage) → `handleConfirmSubmit()` → `insert()` | ❌ **未实现**：使用`insert()`而非`upsert()`，同一天多次提交会创建多条记录 | ⚠️ 有风险 |
| **销量模块** | 前端输入 → `handleSaveSalesModule()` → `upsert()` (onConflict: 'user_id,record_date') | ✅ **已实现**：使用`upsert()` + `onConflict`，同一天多次保存会更新同一条记录 | ✅ 正常 |
| **支出模块** | 前端输入 → `handleExpenseModuleSubmit()` → `upsert()` (onConflict: 'user_id,record_date') | ✅ **已实现**：使用`upsert()` + `onConflict`，同一天多次保存会更新同一条记录 | ✅ 正常 |
| **最终提交** | `handleConfirmSubmit()` → `insert()` (仅收入+销量) | ❌ **未实现**：使用`insert()`，会与销量模块的`upsert()`产生冲突 | ⚠️ 有风险 |

### 关键问题
- **收入模块**：`handleConfirmSubmit()` 第817行使用 `insert()`，如果用户先保存了销量（已创建记录），再提交收入会失败
- **最终提交逻辑**：第817-840行只插入收入+销量，但支出数据已经在 `handleExpenseModuleSubmit()` 中单独保存了，存在数据分散问题

---

## 2. 数据库结构：UNIQUE约束与ON CONFLICT错误

| 项目 | 详情 | 位置 | 状态 |
|------|------|------|------|
| **UNIQUE约束** | ❌ **不存在**：`001_create_daily_records.sql` 中只有索引 `idx_records_user_date`，没有UNIQUE约束 | `supabase/migrations/001_create_daily_records.sql:55` | ⚠️ 缺失 |
| **ON CONFLICT使用** | ✅ 使用 `onConflict: 'user_id,record_date'` | `src/app/record/page.tsx:618, 713` | ✅ 正常 |
| **ON CONFLICT错误位置** | 支出模块：第617行<br>销量模块：第712行 | `src/app/record/page.tsx:617, 712` | ⚠️ 依赖应用层逻辑 |
| **潜在问题** | 如果数据库没有UNIQUE约束，`onConflict`可能不生效，导致重复数据 | - | ⚠️ 高风险 |

### 建议修复
```sql
-- 需要在migration中添加UNIQUE约束
ALTER TABLE daily_records 
ADD CONSTRAINT unique_user_date UNIQUE (user_id, record_date);
```

---

## 3. 技术债与风险

| 类别 | 问题描述 | 位置 | 严重程度 | 影响 |
|------|---------|------|---------|------|
| **数据一致性** | 收入使用`insert()`，销量/支出使用`upsert()`，逻辑不一致 | `page.tsx:817` vs `617,712` | 🔴 高 | 可能导致数据重复或提交失败 |
| **数据分散** | 支出数据在模块提交时保存，收入+销量在最终提交时保存，数据分散 | `page.tsx:567-639, 778-907` | 🟡 中 | 难以保证数据完整性 |
| **输入校验** | 缺少负数校验、金额上限校验、日期格式校验 | 全文件 | 🟡 中 | 可能产生无效数据 |
| **错误处理** | 错误信息仅通过Toast显示，没有详细日志和错误恢复机制 | `page.tsx:717, 638` | 🟡 中 | 难以排查问题 |
| **状态管理** | 大量useState，状态同步复杂（如`totalIncomeConfirmed`影响多个模块） | `page.tsx:114-238` | 🟡 中 | 容易产生状态不一致 |
| **日期处理** | 使用`new Date().toISOString().split('T')[0]`，未考虑时区问题 | `page.tsx:577, 669` | 🟢 低 | 跨时区可能有问题 |
| **类型安全** | 多处使用`any`类型，缺少类型定义 | `page.tsx:190, 547, 636` | 🟡 中 | TypeScript类型检查失效 |
| **COGS计算** | `calculateTodayCOGS()` 固定除以30天，未考虑月份差异 | `page.tsx:712-714` | 🟢 低 | 计算不够精确 |

---

## 4. 未完成清单：UI已实现但逻辑缺失

| 功能 | UI位置 | 逻辑状态 | 缺失内容 |
|------|--------|---------|---------|
| **报表展示** | ❌ 无UI | ❌ 未实现 | 需要创建报表页面，展示历史数据统计 |
| **成本统计** | ✅ 有UI（成绩单中的"经营成本"） | ⚠️ 部分实现 | `calculateTodayCOGS()` 逻辑简单，未考虑实际成本分摊 |
| **历史数据查询** | ❌ 无UI | ❌ 未实现 | 无法查看历史记录，需要列表页和详情页 |
| **数据导出** | ❌ 无UI | ❌ 未实现 | 无法导出Excel/CSV |
| **数据修改** | ✅ 有UI（锁定状态） | ⚠️ 部分实现 | 锁定后无法修改，但缺少"解锁"功能 |
| **多用户支持** | ✅ 有UI（AuthProvider） | ✅ 已实现 | RLS策略已配置，支持多用户 |
| **收入临时保存** | ✅ 有UI（"保存"按钮） | ✅ 已实现 | 使用localStorage临时保存 |

---

## 5. 关键代码位置索引

| 功能 | 文件路径 | 行号范围 | 说明 |
|------|---------|---------|------|
| 收入保存（临时） | `src/app/record/page.tsx` | 642-657 | localStorage临时保存 |
| 收入最终提交 | `src/app/record/page.tsx` | 817-840 | 使用insert()，有问题 |
| 销量模块保存 | `src/app/record/page.tsx` | 660-726 | 使用upsert()，正常 |
| 支出模块保存 | `src/app/record/page.tsx` | 567-639 | 使用upsert()，正常 |
| COGS计算 | `src/app/record/page.tsx` | 712-714 | 简单计算，需优化 |
| 数据库表结构 | `supabase/migrations/001_create_daily_records.sql` | 1-62 | 缺少UNIQUE约束 |

---

## 6. 优先级修复建议

### 🔴 高优先级（立即修复）
1. **添加UNIQUE约束**：在数据库层面保证`(user_id, record_date)`唯一性
2. **统一数据提交逻辑**：将收入的`insert()`改为`upsert()`，或统一使用最终提交

### 🟡 中优先级（近期修复）
1. **完善输入校验**：添加负数、上限、格式校验
2. **改进错误处理**：添加详细错误日志和恢复机制
3. **优化状态管理**：考虑使用useReducer或状态管理库

### 🟢 低优先级（后续优化）
1. **优化COGS计算**：考虑实际成本分摊逻辑
2. **添加历史数据查询**：创建报表页面
3. **添加数据导出功能**

