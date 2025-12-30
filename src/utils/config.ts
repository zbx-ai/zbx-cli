import path from 'path';
import fs from 'fs-extra';
import jiti from 'jiti';

export interface ZbxConfig {
  registry?: string;
  paths: {
    [key: string]: string;
  };
}

export const loadConfig = (): ZbxConfig => {
  const configPath = path.resolve(process.cwd(), 'zbx.config.ts');
  let userConfig: Partial<ZbxConfig> = {};
  
  if (fs.existsSync(configPath)) {
    const _jiti = jiti(__filename);
    const config = _jiti(configPath);
    userConfig = config.default || config;
  }

  return {
    // 默认指向 GitHub Raw 内容
    registry: 'https://raw.githubusercontent.com/zbx-ai/zbx-cli/main',
    paths: {},
    ...userConfig,
  };
};
