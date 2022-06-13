import { getSimilar } from '../../utils/paths.mjs';
import '../../test/consoleColor/index.js';

const run = entryName => {
  const similar = getSimilar(entryName);

  if (similar.length > 0) {
    similar.sort((a, b) => (a.name < b.name ? -1 : 1)).forEach(file => {
      console.log('找到'.green, file.name.padEnd(12, ' '), file.path);
    });
  } else {
    console.log('没找到'.red, entryName);
  }
};
export default run;
