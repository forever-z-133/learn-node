import path from 'path';
import { hasDownload } from '../../utils/paths.mjs';
import { removeCodeNamePart } from '../../utils/mine.mjs';
import getVideosInTxtFile from './utils/getVideosInTxtFile.mjs';
import '../../test/consoleColor/index.js';

// 兼容只有文件名的情况，自动填上种子文件夹路径
const getRealEntryFile = entryFile => {
  if (/^[Ii]:/.test(entryFile)) return entryFile;
  const name = path.basename(entryFile);
  return path.join('I:\\种子', name);
};

// 该番号是否已下载
const existCodeName = item => hasDownloadCodeNames.includes(item.name);

const has = hasDownload();
const hasDownloadCodeNames = has.map(item => removeCodeNamePart(item.name));

const run = entryFile => {
  const url = getRealEntryFile(entryFile);
  const { errorLinks, matchLinks } = getVideosInTxtFile(url);
  const doneLinks = [];
  const unDoneLinks = [];

  matchLinks.forEach(link => {
    const inner = existCodeName(link);
    inner ? doneLinks.push(link) : unDoneLinks.push(link);
  });

  doneLinks.forEach(link => {
    console.log('已下载'.green, link.name.padEnd(12, ' '), link.url);
  });
  unDoneLinks.forEach(link => {
    console.log('未下载', link.name.padEnd(12, ' '), link.url);
  });
  errorLinks.forEach(link => {
    console.log('异常'.red, link.name.padEnd(12, ' '), link.url);
  });
};
export default run;
