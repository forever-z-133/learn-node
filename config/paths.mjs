import path from 'path';
import { getThisDir } from '../utils/paths.mjs';

const thisDir = getThisDir();
const rootPath = path.resolve(thisDir, '..');
const resolve = uri => path.join(rootPath, uri);

export default {
  font: resolve('test/previewFont/entry.mjs'),
  rm: resolve('test/removeSomething/entry.mjs'),
  rmDir: resolve('test/removeEmptyDir/entry.mjs'),
  rename: resolve('mine/rename/entry.mjs'),
  exist: resolve('mine/findExist/entry.mjs'),
  remove: resolve('mine/findNotGood/entry.mjs'),
  find: resolve('mine/findNotDownload/entry.mjs'),
  expand: resolve('mine/expand/entry.mjs'),
  check: resolve('mine/check/index.mjs'),
  color: resolve('test/consoleColor/index.js test'),
  alert: resolve('test/alert/entry.mjs'),
  concat: resolve('test/concatVideo/entry.mjs'),
  notify: resolve('test/sendNotify/index.mjs'),
  youtube: resolve('test/youtube/index.mjs'),
  w3c: resolve('test/w3cplus/entry.mjs'),
};
