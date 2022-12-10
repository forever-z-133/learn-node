import path from 'path';
import fs from 'fs-extra';
import { forEachDir } from '../../utils/paths.mjs';
import '../../test/consoleColor/index.js';

const include = (fileStr, units) => units.some(unit => fileStr.endsWith(unit));

const run = (entryDir, types) => {
  const allFiles = [];
  const units = types.split(',');

  forEachDir(entryDir, file => {
    if (include(file, units)) {
      allFiles.push(file);
    }
  });

  allFiles.forEach(file => {
    const output = path.resolve(entryDir, path.basename(file));
    fs.moveSync(file, output);
    console.log('移动', file.black, '到', output.green);
  });
};
export default run;
