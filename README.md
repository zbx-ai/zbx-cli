# ZBX CLI

一个基于 TypeScript 和 Monorepo 结构的公共工具函数 (Utils) 与库 (Libs) 管理脚手架。采用类似 Shadcn UI 的 Registry 方案，支持通过远程 HTTP 地址按需安装代码片段。

## 核心特性

- **Registry 模式**: 类似 Shadcn UI，通过 `registry.json` 索引文件管理资源，无需克隆整个仓库。
- **灵活配置**: 支持通过 `zbx.config.ts` 自定义每个资源的安装路径。
- **Monorepo 友好**: 资源存放在 `packages/` 目录下，按类别（如 frontend, backend）组织。
- **轻量化**: 仅下载你需要的代码，不引入多余的依赖。

## 项目结构

```
zbx-cli/
├── bin/
│   └── zbx.js              # CLI 可执行入口
├── packages/               # 公共资源存放目录
│   ├── frontend/
│   │   └── utils/          # 示例：前端工具函数
│   └── backend/
│   │   └── utils/          # 示例：后端工具函数
├── src/
│   ├── commands/
│   │   └── add.ts          # `add` 命令实现逻辑
│   ├── utils/
│   │   └── config.ts       # 配置文件加载器
│   └── index.ts            # CLI 主程序
├── package.json            # 项目配置与依赖
├── tsconfig.json           # TypeScript 配置
├── zbx.config.ts           # 默认配置文件
└── README.md               # 使用说明
```

## 快速开始

### 1. 安装与构建

```bash
# 安装依赖
pnpm install
# 构建项目
npm run build
# 全局链接命令行工具（开发调试用）
npm link
```

### 2. 初始化配置

在你的项目根目录创建 `zbx.config.ts`：

```typescript
export default {
  // 远程资源仓库的 Base URL (必须包含 registry.json)
  registry: 'https://raw.githubusercontent.com/zbx-ai/zbx-cli/main',
  
  // 定义资源安装到的本地路径
  paths: {
    'frontend/utils': 'src/shared/utils',
    'backend/utils': 'server/common/utils',
    // 如果不配置，默认会安装到 src/utils 或 src/libs
  }
}
```

### 3. 使用命令

```bash
# 添加前端工具函数
zbx add frontend/utils

# 添加后端工具函数
zbx add backend/utils
```

---

## 资源提供者指南 (如何维护自己的仓库)

如果你想构建自己的公共资源库，请遵循以下步骤：

### 1. 组织目录结构

将你的代码片段放入 `packages` 目录，例如：
- `packages/frontend/utils/`
- `packages/backend/libs/`

### 2. 生成 Registry 索引

每当 `packages` 目录下的文件发生变化时，需要更新 `registry.json`：

```bash
npm run build:registry
```

该脚本会自动扫描 `packages` 目录，记录每个包包含的文件列表。

### 3. 发布

将代码和生成的 `registry.json` 提交并推送到你的 GitHub 仓库。

### 4. 消费者配置

消费者只需将 `zbx.config.ts` 中的 `registry` 指向你的 GitHub Raw 地址即可：
`https://raw.githubusercontent.com/USER/REPO/BRANCH`

---

## 开发与调试

```bash
# 本地开发运行命令
npm run dev -- add frontend/utils

# 生成本地索引测试
npm run build:registry
```

## 许可证

ISC

