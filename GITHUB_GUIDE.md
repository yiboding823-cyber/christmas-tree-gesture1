# 🚀 GitHub 推送指南

本指南将帮助您将圣诞树项目推送到 GitHub，然后通过 Vercel 自动部署。

---

## 📋 前置准备

### 1. 安装 Git

**检查是否已安装：**
```bash
git --version
```

**如果未安装：**
- 访问：https://git-scm.com/download/win
- 下载并安装 Git for Windows
- 安装时选择默认选项即可

### 2. 注册 GitHub 账号

- 访问：https://github.com
- 点击 "Sign up" 注册账号（免费）

---

## 🎯 步骤 1: 在 GitHub 创建仓库

1. **登录 GitHub**
   - 访问 https://github.com

2. **创建新仓库**
   - 点击右上角 "+" → "New repository"
   - 填写信息：
     - **Repository name**: `christmas-tree-gesture` (或您喜欢的名字)
     - **Description**: `Interactive Christmas Tree with Hand Gesture Control`
     - **Public** 或 **Private**: 选择 Public（公开）
     - ⚠️ **不要勾选** "Add a README file"
     - ⚠️ **不要勾选** "Add .gitignore"
     - ⚠️ **不要勾选** "Choose a license"
   - 点击 "Create repository"

3. **复制仓库 URL**
   - 创建后会看到一个 URL，类似：
     ```
     https://github.com/your-username/christmas-tree-gesture.git
     ```
   - 复制这个 URL（稍后会用到）

---

## 🎯 步骤 2: 初始化本地 Git 仓库

打开 PowerShell，进入项目目录：

```bash
cd c:/Users/k25056637/.gemini/antigravity/playground/vast-curiosity
```

### 2.1 配置 Git（首次使用）

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2.2 初始化仓库

```bash
git init
```

### 2.3 添加所有文件

```bash
git add .
```

### 2.4 创建首次提交

```bash
git commit -m "Initial commit: Christmas Tree with Hand Gesture Control"
```

### 2.5 添加远程仓库

将下面的 URL 替换为您在步骤 1 复制的 URL：

```bash
git remote add origin https://github.com/your-username/christmas-tree-gesture.git
```

### 2.6 推送到 GitHub

```bash
git branch -M main
git push -u origin main
```

**如果要求登录：**
- 输入您的 GitHub 用户名
- 密码使用 **Personal Access Token**（不是账号密码）

---

## 🔑 创建 GitHub Personal Access Token

如果推送时要求密码，您需要创建一个 Token：

1. **访问 GitHub Settings**
   - 点击右上角头像 → Settings
   - 左侧菜单 → Developer settings
   - Personal access tokens → Tokens (classic)
   - Generate new token (classic)

2. **配置 Token**
   - Note: `Vercel Deployment`
   - Expiration: `90 days` 或 `No expiration`
   - 勾选权限：
     - ✅ `repo` (所有子选项)
   - 点击 "Generate token"

3. **复制 Token**
   - ⚠️ **立即复制并保存**（只显示一次）
   - 在 git push 时用这个 Token 作为密码

---

## 🎯 步骤 3: 验证推送成功

1. **刷新 GitHub 仓库页面**
   - 您应该能看到所有项目文件

2. **检查文件**
   - 确认 `src/`, `public/`, `package.json` 等文件都在

---

## 🎯 步骤 4: 连接 Vercel 自动部署

### 4.1 访问 Vercel

- 打开：https://vercel.com
- 使用 GitHub 账号登录

### 4.2 导入项目

1. 点击 "Add New..." → "Project"
2. 选择 "Import Git Repository"
3. 找到您的 `christmas-tree-gesture` 仓库
4. 点击 "Import"

### 4.3 配置项目

Vercel 会自动检测到 Vite 项目，默认配置：
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

直接点击 "Deploy" 即可！

### 4.4 等待部署

- 首次部署需要 2-5 分钟
- 完成后会显示：
  ```
  ✅ Your project is live!
  https://your-project.vercel.app
  ```

---

## 🎉 完成！

现在您的项目已经：
- ✅ 托管在 GitHub
- ✅ 自动部署到 Vercel
- ✅ 拥有公开访问的 URL

### 后续更新

每次修改代码后：

```bash
git add .
git commit -m "描述您的修改"
git push
```

Vercel 会自动重新部署！

---

## 🔧 常见问题

### Q: git push 失败，提示 "authentication failed"

**解决方案：**
使用 Personal Access Token 而不是密码。参考上面的"创建 GitHub Personal Access Token"部分。

### Q: 推送时提示 "large files"

**解决方案：**
检查 `.gitignore` 文件是否正确排除了 `node_modules` 文件夹。

### Q: Vercel 部署失败

**解决方案：**
1. 检查 GitHub 上的代码是否完整
2. 查看 Vercel 部署日志中的错误信息
3. 确保 `package.json` 中的依赖都正确

---

## 📞 需要帮助？

如果遇到任何问题：
1. 查看 GitHub 文档：https://docs.github.com
2. 查看 Vercel 文档：https://vercel.com/docs
3. 或者告诉我具体的错误信息，我来帮您解决！

---

## 🎄 祝您部署顺利！
