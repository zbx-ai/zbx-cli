#!/usr/bin/env node
const jiti = require("jiti")(__filename);
// 尝试运行 src/index.ts，如果不存在则运行 dist/index.js
try {
  jiti("../src/index.ts");
} catch (e) {
  jiti("../dist/index.js");
}
