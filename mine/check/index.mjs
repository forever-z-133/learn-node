import { hasDownload } from '../../utils/paths.mjs';
import { convertCodeName } from '../../utils/mine.mjs';
import '../../test/consoleColor/index.js';

// 转换后仍不相同的番号
const notSameCodeName = item => item.name !== convertCodeName(item.name);

const run = () => {
  const has = hasDownload();

  const errors = has.filter(item => {
    return notSameCodeName(item);
  });

  errors.forEach(item => {
    console.log('异常'.red, item.path);
  });
};

run();
