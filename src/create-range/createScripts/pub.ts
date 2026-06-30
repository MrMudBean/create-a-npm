import { commandParameters } from '../../data-store/command-parameters';
import { FileName } from '../../data-store/file-name-enum';
import { createCI, writeToFile } from '../../utils';

/**  构建发布  */
export function pub() {
  const { manager } = commandParameters;
  writeToFile(
    FileName.PUB_SH,
    `#!/bin/bash

# 获取环境变量中的变更包字符串
UPDATE_PACKAGES=$UPDATE_PACKAGES
# 执行根路径
REPO_ROOT=$REPO_ROOT
# 发布异常的包
PUB_ERROR=()
CHECK_VERSION="@vvi/check-version"
echo "工作根路径 $REPO_ROOT"
PACKAGES_DIR="\${REPO_ROOT}/packages"
# 将字符串转为数组
IFS=',' read -r -a PACKAGE_ARRAY <<< "$UPDATE_PACKAGES"

log_info() { echo -e "\${GREEN}[INFO]\${NC} $1"; }
log_warn() { echo -e "\${YELLOW}[WARN]\${NC} $1"; }
log_error() { echo -e "\${RED}[ERROR]\${NC} $1"; }
 
update_version() {
    local input="$1"
    local NAME=$(echo "\${input//-/ }" | tr -s ' ') # 替换 - 为空格并删除重复的空格
    local CWD="\${PACKAGES_DIR}/$input"

    local TAG=""
    cd $REPO_ROOT # 每次需要手动更新到根下才能正确的校验版本号
    if ! TAG=$(npx --yes "\${CHECK_VERSION}" n=\${input} 2>&1); then
       log_error "未通过版本校验：$TAG"
       return 0 
    fi
    log_info "获取 \${NAME} 的发布标签为 \${TAG}"

    if [ ! -d "$CWD" ]; then 
        log_error "进入项目 $NAME 故障，路径为 \${CWD}"
        return 0
    fi
    cd "$CWD"

    # 依赖安装 
    ${createCI()}
    if ! ${manager.value} run build; then 
      log_error "构建 $NAME 失败" 
      PUB_ERROR+=("$input")
      return 0
    fi
    local BUILD_DIST="\${CWD}/dist"
    if [ ! -d "\${BUILD_DIST}" ]; then
      log_warn "未找到 $NAME dist 构建：\${BUILD_DIST}"
      PUB_ERROR+=("$input")
      return 0
    fi
    cd "\${BUILD_DIST}" 
    
    log_info "开始发布 $NAME npm 包 \${TAG} 版本"
    if ! ${manager.value} publish --provenance --access public --tag "\${TAG}" --no-git-checks; then
        log_error "💥💥💥 $NAME 发布到 npm 💥💥💥"
        PUB_ERROR+=("$input")
    else 
        log_info "🪧 $package  发布终结 🫧🫧🫧🫧🫧🫧"
    fi
}

main() {
    if [ ! -d "$PACKAGES_DIR" ]; then
      log_error "没有找到 \${PACKAGES_DIR}"
      exit 0
    fi
    # 遍历变更的包数组，进行 npm 包推送
    for package in "\${PACKAGE_ARRAY[@]}"; do
        log_info "当前执行的推送为 $package"
        update_version "$package"
    done

}

log_info "准备好了么"
main
if [ \${#PUB_ERROR[@]} -gt 0 ]; then 
   log_warn "发布包 \${PUB_ERROR[@]} 异常 "
else 
   log_info "所有发布均已成功：\${PACKAGE_ARRAY[@]}"
   long_info "🚀🚀 发布成功，完结 🎉🎉 撒花 🎉🎉"
fi`,
    'range',
  );
}
