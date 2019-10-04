const fs = require('fs');
const path = require('path');
const { addZero, useCache } = require('./index');

// 转化为可用番号
function convertName(name) {
	return name.replace(/(.*?)(add|\-|\_)(.*)/, (match, pre, add, next) => {
    if (pre.length >= 5) pre = pre.replace(/(DB|HD|BD)$/i, '');
    return pre.toUpperCase() + 'add' + addZero(next.toUpperCase(), 3);
  });
}

// 获取已下载的番号
function hasDownload(dirs) {
  if (typeof dirs === 'string') dirs = [dirs];
  dirs = dirs || ['F:\下载', 'F:\下载3', 'I:\无码', 'I:\有码'];
  return dirs.reduce((re, dir) => {
    let names = fs.readdirSync(dir) || [];
    names = names.map(name => {
      return {
        fileName: name.split('.')[0],
        filePath: path.resolve(dir, name).replace(/\\/g, '/'),
      }
    })
    return re.concat(names) ;
  }, []);
}
hasDownload = useCache(hasDownload);

// 从已下载中找到相应番号
function find(name, dirs) {
  if (!name) return null;
	name = convertName(name);
	const has = hasDownload(dirs);
  return has.filter(item => {
    return item.fileName.includes(name);
  })[0];
}

module.exports = {
  convertName,
  hasDownload,
  find
}
module.exports.default = module.exports;