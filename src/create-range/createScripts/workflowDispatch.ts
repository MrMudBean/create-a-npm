import { writeFileSync } from 'node:fs';
import { dataStore } from '../../data-store/index';
/**  手动发布审视  */
export function workflowDispatch() {
  writeFileSync(
    dataStore.rangeFile('scripts/workflow_dispatch.sh'),
    `#!/bin/bash

# 从环境变量中获取手动触发要更新的包数据
INPUT_PACKAGE=$INPUT_PACKAGE
# 初始化变更的包数组
CHANGED_PACKAGE_ARRAY=()
# 初始化最终要更新的包的数组
UPDATE_PACKAGE_ARRAY=()

# 读取 packages 下直接子文件夹名并放入到数组 CHANGED_PACKAGE_ARRAY 中 
while IFS= read -r PACKAGE_DIR; do 
   PACKAGE_DIR=$(echo "\${PACKAGE_DIR// /?}" | tr -s '?') #  保护我方空格
   CHANGED_PACKAGE_ARRAY+=("$PACKAGE_DIR")
done < <(find packages -mindepth 1 -maxdepth 1 -type d -exec basename {} \\;)

check_version() {
  local input="$1"
  local NAME=$(echo "\${input//-/ }" | tr -s ' ') # 替换 - 为空格并删除重复的空白字符
  echo "输入：\${input}"
  echo "使用：\${NAME}"
 
  # 该包是否由手动触发选择
  if [ "$INPUT_PACKAGE" = "all" ] || [ "$INPUT_PACKAGE" = "\${input}" ]; then
    echo "手动触发发布且包含 \${NAME}"
    UPDATE_PACKAGE_ARRAY+=("$input")
    return 0
  else
    echo "该包 \${input} 未在手动触发选择"
    return 0
  fi
}


main() {
  for PACKAGE_NAME in \${CHANGED_PACKAGE_ARRAY[@]}; do 
     check_version "$PACKAGE_NAME"
  done

  echo "校验版本数据完毕 \${UPDATE_PACKAGE_ARRAY}"

  # 将数组转为逗号分隔的字符串
  UPDATE_PACKAGES=$(IFS=,; echo "\${UPDATE_PACKAGE_ARRAY[*]}")

  # 将变更的包字符串输出到环境变量
  # echo "update_packages=$UPDATE_PACKAGES" >> $GITHUB_OUTPUT    
  echo "update_packages=$UPDATE_PACKAGES" >> $GITHUB_ENV

  printf "\\e[38;5;164m手动触发的包为 \\e[m$UPDATE_PACKAGES \\n"
}
echo "准备好了么"
main
echo "哈哈，执行 🎊 🎊 🎊"
`,
  );
}
