# GitHub Pages 部署调试指南

## 如何排查部署失败问题

### 1. 查看 GitHub Actions 日志

访问：`https://github.com/MBBmba2002/my-restaurant-app/actions`

点击最新的 workflow run，查看以下步骤的输出：

#### 🔍 关键检查点：

1. **Build (Static Export) 步骤**
   - 检查是否有编译错误
   - 查看 "Next.js config check" 部分
   - 查看 "Source files check" 部分
   - 确认构建成功完成

2. **Verify build output 步骤**
   - 查看 "Build output directory structure" - 这里会显示所有生成的文件
   - 查看 "Verifying required files" - 检查哪些文件缺失
   - 如果失败，查看 "Full directory tree" - 看实际生成了哪些文件

### 2. 本地诊断

运行诊断脚本：

```bash
./scripts/diagnose-build.sh
```

或者手动检查：

```bash
# 1. 清理并重新构建
rm -rf .next out
npm install
npm run export

# 2. 检查输出
ls -la out/
find out -name "*.html" | sort

# 3. 验证关键文件
test -f out/index.html && echo "✓ index.html exists" || echo "✗ index.html missing"
test -f out/login/index.html && echo "✓ login/index.html exists" || echo "✗ login/index.html missing"
```

### 3. 常见问题排查

#### 问题 1: Build 失败 - Module not found

**症状**: 构建时报错 `Module not found: Can't resolve '@/lib/supabaseClient'`

**解决方法**:
- 确认 `src/lib/supabaseClient.ts` 存在
- 确认 `tsconfig.json` 中 `paths` 配置正确：`"@/*": ["./src/*"]`
- 清理缓存：`rm -rf .next node_modules && npm install`

#### 问题 2: out/ 目录为空或不完整

**症状**: Build 成功但 `out/` 目录没有文件或缺少 `login/index.html`

**可能原因**:
- Next.js 版本问题
- `next.config.ts` 配置错误
- 构建过程中有警告导致某些页面未生成

**解决方法**:
- 检查 `next.config.ts` 确保有 `output: "export"`
- 检查构建日志中是否有警告
- 尝试在本地运行 `npm run export` 看是否正常

#### 问题 3: GitHub Actions 中文件路径不对

**症状**: 本地正常，但 GitHub Actions 失败

**可能原因**:
- 环境变量未设置（NEXT_PUBLIC_SUPABASE_URL 等）
- 构建环境不同（Linux vs macOS）

**解决方法**:
- 在 GitHub 仓库 Settings → Secrets and variables → Actions 中设置环境变量
- 查看 GitHub Actions 日志中的完整错误信息

#### 问题 4: 部署后页面 404

**症状**: 部署成功但访问 `/login/` 返回 404

**可能原因**:
- basePath 配置问题
- 文件路径不对
- GitHub Pages 配置问题

**解决方法**:
- 确认访问 URL 是：`https://mbbmba2002.github.io/my-restaurant-app/login/`（注意末尾斜杠）
- 检查 GitHub Pages 设置，确保 Source 是 "GitHub Actions"

### 4. 查看具体错误信息

在 GitHub Actions 日志中，查找：
- `❌` 标记的错误
- `Build error occurred`
- `Module not found`
- `Verification failed`

复制完整的错误信息，这些信息会帮助我们定位问题。

### 5. 测试步骤

按顺序执行：

```bash
# 步骤 1: 完全清理
rm -rf .next out node_modules

# 步骤 2: 重新安装依赖
npm install

# 步骤 3: 构建
npm run export

# 步骤 4: 验证
ls -la out/
test -f out/login/index.html && echo "SUCCESS" || echo "FAILED"
```

如果本地成功但 GitHub Actions 失败，说明是环境差异问题。

## 获取帮助

如果问题仍未解决，请提供：
1. GitHub Actions 日志的完整输出（特别是错误部分）
2. 本地诊断脚本的输出
3. `next.config.ts` 的完整内容
4. 任何相关的错误消息





