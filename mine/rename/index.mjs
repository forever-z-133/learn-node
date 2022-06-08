import fs from 'fs';
import path from 'path';
import { convertCodeName } from '../../utils/mine.mjs';
import { hasDownload } from '../../utils/paths.mjs';
import '../../test/consoleColor/index.js';

// 文件重命名
const renameSync = file => {
  const { path: url, dir, newName, ext } = file;
  fs.renameSync(url, path.join(dir, `${newName}${ext.toLowerCase()}`));
};

// 判断番号是否唯一，
const judgeUnique = () => {
  const uniqueMap = {};
  return (key, value) => {
    const inner = uniqueMap[key] || [];
    uniqueMap[key] = [...inner, value];
    return {
      is: inner.length < 1,
      matcher: inner,
    };
  };
};

const run = entryDir => {
  const files = hasDownload([entryDir]);

  const unNeedRename = []; // 不变的
  const needRename = []; // 要变的
  const conflict = []; // 变化后会重名的
  const unique = judgeUnique(); // 重名的
  files.forEach(file => {
    const newName = convertCodeName(file.name);
    const { is: isUnique, matcher } = unique(newName, file);

    if (!isUnique) {
      conflict.push({ file, newName, matcher });
    } else if (file.name === newName) {
      unNeedRename.push({ file, newName });
    } else {
      needRename.push({ file, newName });
    }
  });

  unNeedRename.forEach(({ file, newName }) => {
    console.log('不变'.green, newName.padEnd(12, ' '), file.path);
  });

  needRename.forEach(({ file, newName }) => {
    console.log('改变'.yellow, newName.padEnd(12, ' '), file.path);
    renameSync({ ...file, newName });
  });

  conflict.forEach(({ file, newName, matcher }) => {
    console.log('同名'.red, newName.padEnd(12, ' '), file.path, matcher.map(e => e.path).join(' '));
  });
};
export default run;
