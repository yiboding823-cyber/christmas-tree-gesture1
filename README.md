# 🎄 Interactive Christmas Tree with Hand Gesture Control

一个使用 React Three Fiber 和 TensorFlow.js 构建的交互式圣诞树项目，通过手势识别实现实时控制。

![Christmas Tree Demo](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.163-orange)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.11-yellow)

## ✨ 特性

- 🎁 **1,125 个浮动礼物盒** - 组成完整的圣诞树形状
- 🖐️ **实时手势识别** - 使用摄像头检测手掌张开程度
- 🌊 **渐进式控制** - 手掌张开 0-100% 对应树的散开程度
- 🎨 **豪华配色** - 深绿色和红色主题
- ✨ **后处理效果** - Bloom 光晕和色调映射
- 🎯 **双重控制** - 手势 + UI 按钮

## 🚀 在线演示

访问：[您的 Vercel URL]

## 📋 本地运行

### 前置要求

- Node.js 18+ 
- npm 或 yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/your-username/christmas-tree-gesture.git

# 进入目录
cd christmas-tree-gesture

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:5173`

## 🎮 使用方法

1. **允许摄像头权限** - 首次访问时浏览器会请求权限
2. **等待模型加载** - TensorFlow.js 模型需要 5-10 秒加载
3. **开始交互**：
   - ✊ **握拳** → 礼物聚合成树形
   - ✋ **张开手掌** → 礼物散开
   - 🖐️ **部分张开** → 渐进式变化

或使用屏幕上的按钮控制。

## 🛠️ 技术栈

- **React 18** - UI 框架
- **Three.js** - 3D 渲染引擎
- **React Three Fiber** - React 的 Three.js 渲染器
- **React Three Drei** - 有用的 R3F 辅助工具
- **TensorFlow.js** - 机器学习框架
- **HandPose Model** - 手部关键点检测
- **Vite** - 构建工具
- **TypeScript** - 类型安全

## 📁 项目结构

```
src/
├── components/
│   ├── Scene.tsx          # 3D 场景设置
│   ├── Tree.tsx           # 圣诞树组件
│   ├── HandGesture.tsx    # 手势识别
│   └── UI.tsx             # 控制按钮
├── App.tsx                # 主应用
└── main.tsx               # 入口文件
```

## 🎨 自定义

### 修改颜色

编辑 `src/components/Tree.tsx` 中的 `colors` 数组：

```typescript
const colors = [
  '#0A5F38', // 深绿色
  '#8B0000', // 深红色
  // 添加您的颜色...
]
```

### 调整礼物数量

修改 `count` 值：

```typescript
const count = 1125 // 增加或减少
```

### 调整手势灵敏度

编辑 `src/components/HandGesture.tsx`：

```typescript
const minDistance = 30  // 闭合阈值
const maxDistance = 150 // 张开阈值
```

## 📦 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 部署到 Vercel
npm run deploy
```

详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- Three.js 社区
- TensorFlow.js 团队
- React Three Fiber 维护者

## 📞 联系

如有问题或建议，请通过 GitHub Issues 联系。

---

⭐ 如果您喜欢这个项目，请给它一个星标！

🎄 祝您圣诞快乐！
