import { hasDownload } from '../../utils/paths.mjs';
import { removeCodeNamePart } from '../../utils/mine.mjs';
import '../../test/consoleColor/index.js';

const has = hasDownload();

// 保持 array 值唯一的  push
const uniquePush = (array, ...items) => {
  items.flat().forEach(item => {
    if (!array.some(file => file.base === item.base)) {
      array.push(item);
    }
  });
};

// 判断番号结尾是否连号，比如 ABP-607A ABP-607B
const consecutive = files => {
  if (files.length < 2) return false;
  let ok = true;
  files.reduce((re, file) => {
    const lastCode = file.name.slice(-1).codePointAt();
    if (lastCode === re) return re + 1;
    ok = false; return re;
  }, 65);
  return ok;
};

const run = () => {
  const sameKeyMap = {};
  const needCheckMap = {};

  // 把带结尾的和相同番号的，存进 map 方便后续计算
  has.forEach(file => {
    const name = removeCodeNamePart(file.name);
    if (!sameKeyMap[name]) sameKeyMap[name] = [];
    if (!needCheckMap[name]) needCheckMap[name] = [];

    if (name !== file.name) {
      // 带结尾的番号，可能会存在非连号的错误番号
      uniquePush(needCheckMap[name], file);
    } else if (sameKeyMap[name].length > 0) {
      // 存在同名的番号，可能会存在文件格式不一的重复文件
      sameKeyMap[name].concat(file).forEach(item => {
        uniquePush(needCheckMap[name], item);
      });
    }

    sameKeyMap[name].push(file);
  });

  // 遍历 map，打印结果
  Object.keys(needCheckMap).forEach(name => {
    const files = needCheckMap[name];
    if (files.length < 1) return;

    const sorted = files.sort((a, b) => a.name > b.name ? 1 : -1);
    if (!consecutive(sorted)) {
      console.group(name.green);
      console.log(files.map(e => e.path).join('\n'));
      console.groupEnd();
    }
  });
};

run();
