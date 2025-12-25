# 环境变量配置指南

## GitHub Pages 部署环境变量问题

### 问题说明

Next.js 静态导出 (`output: "export"`) 时，`NEXT_PUBLIC_*` 环境变量会在**构建时**被内联到 JavaScript 代码中。

这意味着：
- ✅ 如果构建时环境变量存在且正确，它们会被写入到静态文件中
- ❌ 如果构建时环境变量缺失或错误，生成的静态文件会包含占位符或空值

### 当前错误："Failed to fetch"

这个错误通常表示：
1. Supabase URL 或 Key 未正确设置
2. 构建时使用了占位符值
3. 运行时尝试连接到无效的 Supabase 端点

### 解决方案

#### 方案 1: 确保 GitHub Actions 构建时使用正确的 Secrets（推荐）

1. **检查 GitHub Secrets 是否设置**：
   - 访问：`https://github.com/MBBmba2002/my-restaurant-app/settings/secrets/actions`
   - 确认以下 Secrets 存在：
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **设置正确的值**：
   - 从 Supabase Dashboard 获取：
     - Settings → API → Project URL → 复制到 `NEXT_PUBLIC_SUPABASE_URL`
     - Settings → API → anon public key → 复制到 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **重新触发构建**：
   - 推送一个空提交或重新运行失败的 workflow

#### 方案 2: 本地构建并手动部署（临时方案）

如果你有本地 `.env.local` 文件：

```bash
# 本地构建
npm run export

# 手动上传 out/ 目录到 GitHub Pages
```

#### 方案 3: 检查构建日志

查看 GitHub Actions 构建日志：
1. 访问：`https://github.com/MBBmba2002/my-restaurant-app/actions`
2. 打开最新的 workflow run
3. 查看 "Build (Static Export)" 步骤
4. 检查 "🔑 Environment variables check" 部分：
   - 如果显示 "⚠️ is not set" → Secrets 未配置
   - 如果显示 "✓ is set" → 环境变量已配置，检查值是否正确

### 验证步骤

部署后，在浏览器控制台（F12）中检查：

```javascript
// 检查环境变量是否被正确内联
console.log(window.__NEXT_DATA__?.env);
```

或者查看网络请求：
- 打开开发者工具 → Network 标签
- 尝试登录，查看失败的请求
- 检查请求 URL 是否正确

### 常见问题

**Q: 为什么本地正常，但线上失败？**
A: 本地可能使用了 `.env.local`，但 GitHub Actions 需要使用 Secrets。

**Q: 如何确认 Secrets 是否正确？**
A: 在 GitHub Actions 日志中查看 "Environment variables check" 步骤的输出。

**Q: 修改 Secrets 后需要做什么？**
A: 需要重新触发构建（推送代码或手动重新运行 workflow）。





