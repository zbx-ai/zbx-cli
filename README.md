# ZBX CLI

A CLI tool for managing shared utils and libs in a monorepo structure.


```sh
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


## Installation

```bash
# 安装依赖
pnpm install
# 构建项目
npm run build
# 全局链接命令行工具
npm link
```

## Usage

### Configuration

Create a `zbx.config.ts` in your project root:

```typescript
export default {
  // Optional: Custom registry URL (defaults to https://raw.githubusercontent.com/zbx-ai/zbx-cli/main)
  // The CLI will look for ${registry}/registry.json
  registry: 'https://raw.githubusercontent.com/your-org/your-repo/main',
  paths: {
    'frontend/utils': 'src/shared/utils',
    'backend/utils': 'server/utils',
    // Add more mappings here
  }
}
```

### Registry Management

To use this CLI with your own repository, you need to generate a `registry.json` file.

1.  Place your shared code in the `packages` directory.
2.  Run the build script to generate `registry.json`:

```bash
npm run build:registry
```

3.  Commit and push `registry.json` to your repository.

### Commands

#### Add a resource

```bash
zbx add frontend/utils
```

This will copy the contents of `packages/frontend/utils` to the path defined in `zbx.config.ts` (e.g., `src/shared/utils`).

## Development

```bash
# Run in development mode
npm run dev -- add frontend/utils
```
