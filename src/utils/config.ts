import path from 'path';
import fs from 'fs-extra';
import jiti from 'jiti';

export interface ZbxConfig {
  paths: {
    [key: string]: string;
  };
}

export const loadConfig = (): ZbxConfig => {
  const configPath = path.resolve(process.cwd(), 'zbx.config.ts');
  if (!fs.existsSync(configPath)) {
    return { paths: {} };
  }
  
  const _jiti = jiti(__filename);
  const config = _jiti(configPath);
  return config.default || config;
};
