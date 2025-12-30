import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { loadConfig } from '../utils/config';

// 定义 Registry 类型
interface RegistryItem {
  files: string[];
  type: string;
}

interface Registry {
  [key: string]: RegistryItem;
}

export const addCommand = new Command('add')
  .description('Add a shared resource to your project')
  .argument('<resource>', 'Resource path (e.g., frontend/utils)')
  .action(async (resource: string) => {
    const spinner = ora(`Checking registry...`).start();
    
    try {
      const config = loadConfig();
      const registryBaseUrl = config.registry!.replace(/\/$/, ''); // 移除末尾斜杠
      const registryUrl = `${registryBaseUrl}/registry.json`;

      // 1. 获取 Registry 索引
      let registry: Registry;
      try {
        const response = await fetch(registryUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch registry: ${response.statusText}`);
        }
        registry = await response.json() as Registry;
      } catch (e) {
        spinner.fail(`Failed to connect to registry at ${registryUrl}`);
        console.error(e);
        return;
      }

      // 2. 检查资源是否存在
      const item = registry[resource];
      if (!item) {
        spinner.fail(`Resource not found: ${resource}`);
        console.log(chalk.yellow(`Available packages:`));
        Object.keys(registry).forEach(key => {
            console.log(`- ${key}`);
        });
        return;
      }

      spinner.text = `Downloading ${resource}...`;

      // 3. 确定目标路径
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
      
      // 4. 下载文件
      for (const file of item.files) {
        const fileUrl = `${registryBaseUrl}/packages/${resource}/${file}`;
        const fileDest = path.join(targetPath, file);
        
        spinner.text = `Downloading ${file}...`;
        
        try {
            const fileResponse = await fetch(fileUrl);
            if (!fileResponse.ok) {
                console.warn(chalk.yellow(`\nSkipping ${file}: ${fileResponse.statusText}`));
                continue;
            }
            
            const content = await fileResponse.text();
            await fs.outputFile(fileDest, content);
        } catch (e) {
            console.error(chalk.red(`\nError downloading ${file}`));
        }
      }
      
      spinner.succeed(chalk.green(`Successfully added ${resource} to ${targetDir}`));
      
    } catch (error) {
      spinner.fail('Failed to add resource');
      console.error(error);
    }
  });
