# 🚀 部署指南 - 圣诞树手势交互项目

本文档提供了将项目部署到 Vercel 的详细步骤。

## 📋 前置要求

- Node.js 已安装
- 项目可以在本地正常运行 (`npm run dev`)
- 一个 GitHub/GitLab/Bitbucket 账号（可选，但推荐）

---

## 方法 1: 使用 Vercel CLI（推荐）

### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

### 步骤 2: 登录 Vercel

```bash
vercel login
```

选择您的登录方式（GitHub、GitLab、Bitbucket 或 Email）

### 步骤 3: 部署项目

在项目根目录运行：

```bash
vercel
```

按照提示操作：
- **Set up and deploy?** → Yes
- **Which scope?** → 选择您的账号
- **Link to existing project?** → No
- **What's your project's name?** → christmas-tree-gesture (或自定义名称)
- **In which directory is your code located?** → ./ (直接回车)
- **Want to override the settings?** → No (直接回车)

### 步骤 4: 获取 URL

部署完成后，您会看到：
```
✅  Production: https://your-project.vercel.app
```

这就是您的公开访问地址！

### 步骤 5: 后续更新

每次修改代码后，只需运行：

```bash
vercel --prod
```

---

## 方法 2: 使用 Vercel 网站（图形界面）

### 步骤 1: 推送代码到 Git

如果还没有 Git 仓库：

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 步骤 2: 导入到 Vercel

1. 访问 https://vercel.com
2. 点击 "New Project"
3. 导入您的 Git 仓库
4. Vercel 会自动检测到 Vite 配置
5. 点击 "Deploy"

### 步骤 3: 自动部署

之后每次 `git push`，Vercel 会自动重新部署！

---

## 🎯 重要提示

### 摄像头权限

⚠️ **手势识别功能需要 HTTPS 才能访问摄像头**

Vercel 自动提供 HTTPS，所以手势功能会正常工作。

### 首次访问

用户首次访问时需要：
1. 允许摄像头权限
2. 等待 TensorFlow.js 模型加载（约 5-10 秒）

### 性能优化

项目已配置：
- ✅ 代码分割
- ✅ 资源压缩
- ✅ 全球 CDN 加速

---

## 📱 分享链接

部署完成后，您可以分享：

```
https://your-project.vercel.app
```

建议添加说明：
- 需要允许摄像头权限
- 最佳体验：Chrome/Edge 浏览器
- 手掌张开/合拢控制圣诞树散开/聚合

---

## 🔧 故障排除

### 问题 1: 构建失败

检查 `package.json` 中的依赖是否完整：

```bash
npm install
npm run build
```

### 问题 2: 摄像头无法访问

确保：
- 使用 HTTPS（Vercel 自动提供）
- 浏览器支持 WebRTC
- 用户已授予摄像头权限

### 问题 3: 模型加载慢

TensorFlow.js 模型首次加载需要时间，这是正常的。可以考虑：
- 添加加载进度条
- 使用更轻量的模型

---

## 📊 监控和分析

Vercel 提供：
- 访问统计
- 性能监控
- 错误日志

访问 https://vercel.com/dashboard 查看详情。

---

## 🎄 祝您部署顺利！

有任何问题，请查看：
- Vercel 文档: https://vercel.com/docs
- 项目 README: ./README.md
