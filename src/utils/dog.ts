import { Dog } from '@qqi/log';

/**  dev log  */
export const dog = new Dog({
  name: 'create a npm',
  type: false,
});

/**  开发环境  */
export const dun = !!dog.type;
