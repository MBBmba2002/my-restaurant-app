# 修复 "Signups not allowed for this instance" 错误

## 问题描述

当尝试注册新用户时，看到错误信息：
```
Signups not allowed for this instance
```

## 解决方案

这个错误是因为 Supabase 项目配置中禁用了新用户注册功能。需要按以下步骤启用：

### 方法 1：通过 Authentication Settings（推荐）

1. **登录 Supabase Dashboard**
   - 访问：https://supabase.com/dashboard
   - 选择你的项目

2. **进入 Authentication 设置**
   - 在左侧菜单中点击 **Authentication**
   - 然后点击 **Settings** 或 **Configuration**（根据你的 Supabase 版本）

3. **启用用户注册**
   - 找到 **"Enable Sign Ups"** 选项
   - 如果看到 **"Disable Sign Ups"** 是开启状态，**关闭它**（即启用注册）
   - 或者如果看到 **"Enable Sign Ups"** 是关闭状态，**开启它**

4. **保存设置**
   - 点击页面底部的 **"Save"** 按钮

### 方法 2：通过 Auth Configuration API

如果 Dashboard 中没有找到该选项，可能需要通过 SQL 查询来检查：

```sql
-- 检查当前设置
SELECT * FROM auth.config;
```

### 验证

完成配置后：
1. 刷新你的应用页面
2. 再次尝试注册新用户
3. 应该不再出现 "Signups not allowed" 错误

### 常见位置

根据 Supabase 版本，该设置可能位于：
- **Authentication** → **Settings** → **Auth Settings**
- **Authentication** → **Configuration** → **Auth Configuration**
- **Project Settings** → **Auth** → **Auth Settings**

如果找不到，可以尝试：
- 在 Dashboard 中搜索 "signup" 或 "sign up"
- 查看 Supabase 文档：https://supabase.com/docs/guides/auth/auth-disabling-sign-ups

