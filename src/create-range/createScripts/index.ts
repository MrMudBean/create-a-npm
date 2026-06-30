import { mkdirSync } from 'node:fs';
import { dataStore } from '../../data-store/index';
import { detectChanges } from './detectChanges';
import { pub } from './pub';
import { workflowDispatch } from './workflowDispatch';

/**  写 scripts  */
export function createScripts() {
  // 创建外层目录
  mkdirSync(dataStore.rangeFile('scripts'), { recursive: true });
  detectChanges(); // 检测文件的更替
  pub(); // 发布脚本
  workflowDispatch(); // CI 工作流程
}
