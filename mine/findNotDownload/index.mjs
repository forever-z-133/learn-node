import getVideosInTxtFile from './utils/getVideosInTxtFile.mjs';
import '../../test/consoleColor/index.js';
import { hasDownload } from '../../utils/paths.mjs';

// 去掉番号的后缀
const codeNamePartReg = /[A-E]$/;
const removeCodeNamePart = name => name.replace(codeNamePartReg, '');

// 该番号是否已下载
const existCodeName = item => hasDownloadCodeNames.includes(item.name);

const has = hasDownload();
const hasDownloadCodeNames = has.map(item => removeCodeNamePart(item.name));

const run = entryFile => {
  const { errorLinks, matchLinks } = getVideosInTxtFile(entryFile);
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
