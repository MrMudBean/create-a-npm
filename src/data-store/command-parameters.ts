import { CommandParameters } from '../types';

/**  使用命令  */
export const commandParameters: CommandParameters = {
  manager: {
    value: '',
    accept: ['npm', 'yarn', 'pnpm'],
  },
};
