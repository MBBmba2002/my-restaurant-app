# Supabase 配置说明

## 邮箱+密码登录配置

本项目使用邮箱+密码注册/登录模式，注册后自动登录（不需要邮箱验证）。

### ⚠️ 重要：启用用户注册功能

**如果遇到 "Signups not allowed for this instance" 错误，需要先启用注册功能：**

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Authentication** → **Settings**（或 **Configuration**）
4. 找到 **"Enable Signups"** 或 **"Disable Sign Ups"** 选项
5. **确保注册功能是启用状态**（如果看到 "Disable Sign Ups" 是开启的，需要关闭它）
   - 这个选项可能在 **Auth Settings** 页面的顶部
   - 或者在 **Auth** → **Policies** 或 **Auth** → **Configuration** 中

### 1. 在 Supabase Dashboard 中禁用邮箱验证

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Authentication** → **Providers** → **Email**
4. 找到 **"Confirm email"** 选项，将其**关闭（Disable）**
   - 这样注册后用户会立即自动登录，不需要验证邮箱

### 2. 确保 Email Provider 已启用

1. 在 **Authentication** → **Providers** → **Email** 中
2. 确保 **"Enable email provider"** 是**开启状态**

### 3. 配置说明

- **不需要配置 SMTP**（因为不使用邮箱验证）
- **不需要配置 Email Templates**（因为不使用邮箱验证）
- 用户注册后立即可以登录，无需任何邮箱操作

### 4. 测试

1. 访问登录页面：`/login/`
2. 点击「立即注册」切换到注册模式
3. 输入邮箱和密码（至少 6 位）
4. 点击「注册」
5. 应该立即自动登录并跳转到首页

### 5. 注意事项

- 密码最小长度为 6 位（前端验证）
- 如果注册后没有自动登录，检查 Supabase Dashboard 中是否已禁用邮箱验证
- 如果遇到 "User already registered" 错误，说明该邮箱已存在，直接使用「登录」功能

