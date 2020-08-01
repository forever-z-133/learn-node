const fs = require('fs');
const path = require('path');
const { addZero, useCache } = require('./index');

// 获取链接中的番号
// 匹配 110313-691 MKBD-S60 RED-195 21ID-008 这几种番号
function matchName(link) {
  return (link.match(/\d+[\-\_]\d{3,}\w*/) || link.match(/\d*\w+[\-\_]\w?\d{2,}[a-eA-E]?/) || [])[0];
}

// 转化为可用番号
function convertName(name) {
  if (!name) return '';
  return name.replace(/(.*?)(add|\-|\_)(.*)/, (match, pre, add, next) => {
    if (pre.length >= 5) pre = pre.replace(/(DB|HD|BD)$/i, '');
    next = next.replace(/un$/i, '');
    return pre.toUpperCase() + '-' + addZero(next.toUpperCase(), 3);
  });
}

// 获取文件夹里的文件转为数组
function getFilesArray(dir) {
  let names = fs.readdirSync(dir) || [];
  return names.reduce((re, name) => {
    const _dir = path.resolve(dir).replace(/\\/g, '/');
    const url = path.resolve(dir, name).replace(/\\/g, '/');
    const [fileName, unit] = name.split('.');
    if (!fileName || !unit) return re;
    return re.concat([{ name: fileName, unit: unit.toLowerCase(), url, dir: _dir }]);
  }, []);
}
getFilesArray = useCache(getFilesArray);

// 获取已下载的番号
function hasDownload(dirs) {
  if (typeof dirs === 'string') dirs = [dirs];
  dirs = dirs || [
    'F:\\下载',
    'F:\\下载2',
    'F:\\下载3',
    'I:\\下载过',
    'I:\\无码',
    'I:\\有码',
    'G:\\TDDOWNLOAD\\写真'
  ];
  return dirs.reduce((re, dir) => {
    const items = getFilesArray(dir);
    return re.concat(items);
  }, []);
}
hasDownload = useCache(hasDownload);

module.exports = {
  matchName,
  convertName,
  getFilesArray,
  hasDownload
};
module.exports.default = module.exports;
