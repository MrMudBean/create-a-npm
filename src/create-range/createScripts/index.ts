import { mkdirSync } from 'node:fs';
import { dataStore } from '../../data-store/index';
import { checkVersionInstall } from './checkVersionInstall';
import { detectChanges } from './detectChanges';
import { pub } from './pub';
import { workflowDispatch } from './workflowDispatch';

/**  写 scripts  */
export function createScripts() {
  // 创建外层目录
  mkdirSync(dataStore.rangeFile('scripts'), { recursive: true });
  checkVersionInstall();
  detectChanges();
  pub();
  workflowDispatch();
}
