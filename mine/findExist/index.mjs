import { hasDownload } from '../../utils/paths.mjs';
import '../../test/consoleColor/index.js';

const has = hasDownload();

const run = entryName => {
  const similar = has.filter(file => {
    return file.name.includes(entryName) || file.name.toLocaleLowerCase().includes(entryName);
  });

  if (similar.length > 0) {
    similar.forEach(file => {
      console.log('找到', file.path);
    });
  } else {
    console.log('没找到'.red, entryName);
  }
};
export default run;
