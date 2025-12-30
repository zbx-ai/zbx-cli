import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { loadConfig } from '../utils/config';

export const addCommand = new Command('add')
  .description('Add a shared resource to your project')
  .argument('<resource>', 'Resource path (e.g., frontend/utils)')
  .action(async (resource: string) => {
    const spinner = ora(`Adding ${resource}...`).start();
    
    try {
      const config = loadConfig();
      
      // 假设 CLI 运行时，packages 目录在 CLI 项目根目录下
      // __dirname 在 ts-node 下是 src/commands，在 build 后是 dist/commands
      // 我们需要找到项目根目录
      
      // 简单的向上查找逻辑，或者假设结构固定
      // 如果是 ts-node 运行 src/commands/add.ts -> ../../packages
      // 如果是 node 运行 dist/commands/add.js -> ../../packages
      
      const cliRoot = path.resolve(__dirname, '../../');
      const sourcePath = path.join(cliRoot, 'packages', resource);
      
      if (!fs.existsSync(sourcePath)) {
        spinner.fail(`Resource not found: ${resource}`);
        console.log(chalk.red(`Looked in: ${sourcePath}`));
        console.log(chalk.yellow(`Available packages:`));
        const packagesDir = path.join(cliRoot, 'packages');
        if (fs.existsSync(packagesDir)) {
            const items = fs.readdirSync(packagesDir);
            items.forEach(item => {
                console.log(`- ${item}`);
            });
        }
        return;
      }

      // 确定目标路径
      let targetDir = config.paths[resource];
      
      if (!targetDir) {
        // 尝试模糊匹配
        const parts = resource.split('/');
        const lastPart = parts[parts.length - 1];
        targetDir = config.paths[lastPart];
      }
      
      if (!targetDir) {
        // 默认策略
        const parts = resource.split('/');
        const type = parts[parts.length - 1]; // utils or libs
        targetDir = `src/${type}`;
      }
      
      const targetPath = path.resolve(process.cwd(), targetDir);
      
      // 复制文件
      await fs.copy(sourcePath, targetPath, {
        overwrite: true,
        dereference: true,
      });
      
      spinner.succeed(chalk.green(`Successfully added ${resource} to ${targetDir}`));
      
    } catch (error) {
      spinner.fail('Failed to add resource');
      console.error(error);
    }
  });
