const fs = require('fs');
const path = require('path');
const { addZero, useCache } = require('./index');

/// 单个番号文件数据
class CodeFileItem {
  constructor(fileName, name, unit, dir, url) {
    this.fileName = fileName;
    this.name = name;
    this.unit = unit;;
    this.dir = dir;
    this.url = url;
  }
}

// 获取链接中的番号
// 匹配 110313-691 MKBD-S60 RED-195 21ID-008 这几种番号
const d_d_reg = /\d{4,}[\-\_]\d{3,}\w*/;
const w_d_reg = /\d{0,2}\w+[\-\_]\w?\d{2,}[a-eA-E]?/;
function matchName(link) {
  return (link.match(d_d_reg) || link.match(w_d_reg) || [])[0];
}

// 转化为可用番号，比如 unMIDEadd100 转为 MIDE-100
const convert_reg = /(.*?)(add|\-|\_)(.*)/;
function convertName(name) {
  if (!name) return '';
  return name.replace(convert_reg, (match, pre, add, next) => {
    if (pre.length >= 5) pre = pre.replace(/(DB|HD|BD)$/i, '');
    next = next.replace(/un$/i, '');
    return pre.toUpperCase() + '-' + addZero(next.toUpperCase(), 3);
  });
}

// 获取文件夹里的文件转为数组
function getFilesArray(dir) {
  let names = fs.readdirSync(dir) || [];
  return names.reduce((re, fileName) => {
    // const _dir = path.resolve(dir).replace(/\\/g, '/');
    // const url = path.join(_dir, name).replace(/\\/g, '/');
    const _dir = path.resolve(dir);
    const url = path.join(_dir, fileName);
    const temp = fileName.indexOf('.');
    if (temp < 0) return re;
    const name = fileName.slice(0, temp);
    let unit = fileName.slice(temp + 1);
    if (!name || !unit) return re;
    unit = unit.toLowerCase();
    const item = new CodeFileItem(fileName, name, unit, _dir, url);
    re.push(item);
    return re;
  }, []);
}
getFilesArray = useCache(getFilesArray);

// 获取已下载的番号
function hasDownload(dirs) {
  if (typeof dirs === 'string') dirs = [dirs];
  dirs = dirs || ['E:\\bad', 'E:\\下载2', 'E:\\下载3', 'J:\\下载过', 'J:\\无码', 'J:\\有码', 'I:\\TDDOWNLOAD\\写真'];
  return dirs.reduce((re, dir) => {
    const items = getFilesArray(dir);
    return re.concat(items);
  }, []);
}
hasDownload = useCache(hasDownload);

/// 找到番号相似的文件数据
function findSimilarNameFiles(name) {
  name = name.toUpperCase();
  const hasList = hasDownload();
  const similar = hasList.filter(({ name: n }) => n.includes(name));
  return similar;
}

module.exports = {
  matchName,
  convertName,
  getFilesArray,
  hasDownload,
  findSimilarNameFiles,
  CodeFileItem,
};
module.exports.default = module.exports;
