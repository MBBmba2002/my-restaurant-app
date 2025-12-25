# GitHub Actions 错误排查指南

## 错误：Process completed with exit code 1

这个错误表示 workflow 中的某个步骤失败了。按照以下步骤排查：

### 步骤 1: 查看具体的失败步骤

1. 访问 Actions 页面：
   ```
   https://github.com/MBBmba2002/my-restaurant-app/actions
   ```

2. 点击最新的 workflow run（通常是红色的 ❌）

3. 展开 `build` job，查看哪个步骤显示 ❌

### 步骤 2: 根据失败步骤排查

#### 如果是 "Install dependencies" 失败

**可能原因**:
- `package.json` 有问题
- 依赖版本冲突
- 网络问题

**解决方法**:
- 检查 `package.json` 语法
- 尝试本地运行 `npm ci` 看是否有错误

#### 如果是 "Build (Static Export)" 失败

**查看日志中的关键信息**:

1. **配置文件检查**:
   - 如果显示 "next.config.ts not found" → 文件路径问题
   - 如果显示 "Some config not found" → 配置缺失

2. **源文件检查**:
   - 如果显示 "login page missing" → 文件路径错误
   - 如果显示 "supabaseClient missing" → 文件未找到

3. **环境变量检查**:
   - 如果显示 "NEXT_PUBLIC_SUPABASE_URL is not set" → 需要在 GitHub Secrets 中设置
   - 访问：Settings → Secrets and variables → Actions → New repository secret

4. **构建错误**:
   - 查看 "Build failed" 后的错误信息
   - 常见错误：
     - `Module not found` → 导入路径错误
     - `Type error` → TypeScript 类型错误
     - `Syntax error` → 代码语法错误

#### 如果是 "Verify build output" 失败

**查看日志中的验证结果**:

1. **out 目录不存在**:
   - 说明构建没有成功导出
   - 检查 `next.config.ts` 中是否有 `output: "export"`

2. **文件缺失**:
   - 如果显示 "out/index.html NOT FOUND" 或 "out/login/index.html NOT FOUND"
   - 查看 "Full directory tree" 部分，看实际生成了哪些文件
   - 对比本地构建的输出

### 步骤 3: 对比本地构建

在本地执行相同的构建过程：

```bash
# 完全清理
rm -rf .next out node_modules

# 重新安装（模拟 GitHub Actions 的 npm ci）
npm ci

# 构建（注意：本地需要有环境变量）
export NEXT_PUBLIC_SUPABASE_URL="your-url"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key"
npm run export

# 验证
ls -la out/
test -f out/login/index.html && echo "SUCCESS" || echo "FAILED"
```

如果本地成功但 GitHub Actions 失败：
- 检查环境变量是否在 GitHub Secrets 中设置
- 检查 Node.js 版本是否一致（GitHub Actions 使用 Node 20）

### 步骤 4: 检查 GitHub Secrets

确保以下 Secrets 已设置：
1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

设置方法：
1. 访问：`https://github.com/MBBmba2002/my-restaurant-app/settings/secrets/actions`
2. 点击 "New repository secret"
3. 添加每个环境变量

### 步骤 5: 查看完整日志

在 GitHub Actions 日志中，展开失败的步骤，查找：
- `❌` 标记
- `Error:` 或 `error:`
- `failed` 或 `FAILED`
- 堆栈跟踪信息

### 常见错误和解决方案

| 错误信息 | 可能原因 | 解决方法 |
|---------|---------|---------|
| `Module not found: Can't resolve '@/lib/supabaseClient'` | 文件路径或 tsconfig 配置错误 | 确认文件在 `src/lib/`，检查 `tsconfig.json` |
| `out directory not found` | 构建未成功导出 | 检查 `next.config.ts` 中的 `output: "export"` |
| `NEXT_PUBLIC_SUPABASE_URL is not set` | 环境变量未设置 | 在 GitHub Secrets 中设置 |
| `Build failed` | 代码错误或配置问题 | 查看详细的错误信息，修复代码 |

### 获取帮助

如果问题仍未解决，请提供：
1. **失败的步骤名称**（例如："Build (Static Export)"）
2. **该步骤的完整日志**（展开步骤后复制所有输出）
3. **本地构建结果**（运行 `npm run export` 的输出）

这些信息能帮助我们快速定位问题。





