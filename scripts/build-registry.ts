import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

const PACKAGES_DIR = path.join(process.cwd(), 'packages');
const OUTPUT_FILE = path.join(process.cwd(), 'registry.json');

interface RegistryItem {
  files: string[];
  type: string;
}

interface Registry {
  [key: string]: RegistryItem;
}

async function buildRegistry() {
  console.log(chalk.blue('Building registry...'));

  const registry: Registry = {};

  if (!fs.existsSync(PACKAGES_DIR)) {
    console.error(chalk.red('packages directory not found'));
    process.exit(1);
  }

  // 遍历 packages 目录下的分类 (e.g., frontend, backend)
  const categories = await fs.readdir(PACKAGES_DIR);

  for (const category of categories) {
    const categoryPath = path.join(PACKAGES_DIR, category);
    if (!(await fs.stat(categoryPath)).isDirectory()) continue;

    // 遍历分类下的包 (e.g., utils, libs)
    const packages = await fs.readdir(categoryPath);

    for (const pkg of packages) {
      const pkgPath = path.join(categoryPath, pkg);
      if (!(await fs.stat(pkgPath)).isDirectory()) continue;

      const registryKey = `${category}/${pkg}`;
      const files: string[] = [];

      // 递归获取所有文件
      async function scanFiles(dir: string, baseDir: string) {
        const items = await fs.readdir(dir);
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = await fs.stat(itemPath);
          
          if (stat.isDirectory()) {
            await scanFiles(itemPath, baseDir);
          } else {
            // 忽略一些文件
            if (item === 'package.json' || item.endsWith('.test.ts') || item.endsWith('.spec.ts')) return;
            
            const relativePath = path.relative(baseDir, itemPath);
            files.push(relativePath);
          }
        }
      }

      await scanFiles(pkgPath, pkgPath);

      registry[registryKey] = {
        files,
        type: pkg // utils or libs
      };
      
      console.log(chalk.green(`Registered ${registryKey} with ${files.length} files`));
    }
  }

  await fs.writeJSON(OUTPUT_FILE, registry, { spaces: 2 });
  console.log(chalk.blue(`\nRegistry written to ${OUTPUT_FILE}`));
}

buildRegistry().catch(console.error);
