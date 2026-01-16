/**  通用 git、prettier 忽略文件  */
export function gitIgnoreText() {
  return `
node_modules
dist
*.tgz
*.zip
coverage
.DS_Store
.eg`;
}
