import { waitingTips } from '@vvi/node';

/**
 * # 等待
 * 由于 `runOtherCode` 剥离了对三方  `waitings` 的支持，当前该项仅用于退出程序使用（其实放进 utils/index.ts 文件更合适）
 */
export const waiting = waitingTips({
  show: false,
});
