import spawn from 'cross-spawn';
import { removeSync } from '../../utils/others.mjs';
import { forEachDir } from '../../utils/paths.mjs';
import '../consoleColor/index.js';

const run = async (entryDir, flags) => {
  const needRemove = [];

  forEachDir(entryDir, file => {
    if (flags.some(flag => file.includes(flag))) needRemove.push(file);
  });

  await Promise.all(needRemove.map(file => {
    console.log('删除: '.red, file);
    return removeSync(file);
  }));

  spawn.sync('cmd.exe', ['/c', `yarn command rmDir ${entryDir}`], { stdio: 'inherit' });
};
export default run;
