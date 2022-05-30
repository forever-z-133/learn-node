import { resolve } from '../utils/paths.mjs';

export default {
  exist: resolve('mine/findExist/index.js'),
  find: resolve('mine/findNotDownload/index.js'),
  remove: resolve('mine/findNotGood/index.js'),
  rename: resolve('mine/rename/index.js'),
  same: resolve('mine/findSame/index.js'),
  check: resolve('node mine/check/index.js'),
  alert: resolve('test/alert/entry.mjs'),
  w3c: resolve('test/w3cplus/index.js'),
  tui: resolve('node test/tuigirl/index.js'),
  color: resolve('test/consoleColor/index.js test'),
  mp4: resolve('test/m3u8ToMp4/index.js'),
  mp42: resolve('test/m3u8ToMp4ByFfmpeg/index.js'),
  font: resolve('test/previewFont/entry.mjs'),
  readline: resolve('test/readline/index.js'),
  rm: resolve('test/removeSomething/index.js'),
  rmDir: resolve('test/removeEmptyDir/index.js'),
  youtube: resolve('node test/youtube/index.js'),
  concat: resolve('node test/concatVideo/index.js'),
};
