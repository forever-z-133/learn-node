import path from 'path';
import fs from 'fs-extra';
import { forEachDir } from '../../utils/paths.mjs';
import '../../test/consoleColor/index.js';

const run = (entryDir, types) => {
  const should = [];
  const units = types.split(',');

  forEachDir(entryDir, (file, xpath, basename) => {
    const { ext } = path.parse(basename);
    const matchUnit = units.includes(ext);
    const isNotTop = xpath.length > 0;
    if (matchUnit && isNotTop) {
      should.push(file);
    }
  });

  should.forEach(file => {
    const output = path.resolve(entryDir, path.basename(file));
    fs.moveSync(file, output);
    console.log('移动', file.black, '到', output.green);
  });
};
export default run;
