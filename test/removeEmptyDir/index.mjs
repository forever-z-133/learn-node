import fs from 'fs-extra';
import { forEachDir } from '../../utils/paths.mjs';
import '../consoleColor/index.js';

const run = entryDir => {
  const needRemove = [];

  forEachDir(entryDir, undefined, dir => {
    const files = fs.readdirSync(dir);
    if (files.length < 1) needRemove.push(dir);
  });

  needRemove.forEach(dir => {
    console.log('删除：'.red, dir);
    fs.removeSync(dir);
  });
};
export default run;
