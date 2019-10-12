const fs = require('fs');
const path = require('path');
const https = require('https');

// 类型判断
function typeOf(obj) {
  var typeStr = Object.prototype.toString.call(obj).split(" ")[1];
  return typeStr.substr(0, typeStr.length - 1).toLowerCase();
}

// 包括其下所有文件及文件夹
function emptyDirSync(dir) {
  const files = [];
  try {
    files = fs.readdirSync(dir)
  } catch (err) {
    return mkdir.mkdirsSync(dir)
  }
  files.forEach(file => {
    let url = dir + "/" + file;
    if (fs.statSync(url).isDirectory()) {
      emptyDirSync(url); // 递归删除文件夹
      fs.rmdirSync(url);
    } else {
      fs.unlinkSync(url); // 删除文件
    }
  });
}

// 删除文件夹
function removeDirSync(url) {
  emptyDirSync(url);
  fs.rmdirSync(url);
}

// 新建文件夹
function makeDirSync(dir) {
  !fs.existsSync(dir) && fs.mkdirSync(dir);
}

// 下载文件
function _download(url, output, fileName, callback) {
  if (typeof fileName === 'function') {
    callback = fileName; fileName = null
  }
  fileName = fileName || getFileName(url);
  if (!fileName) throw new Error('没找到文件名');
  let filePath = path.join(output);
  if (filePath.lastIndexOf(fileName) < 0) {
    filePath = path.join(output, fileName);
  }
  const stream = fs.createWriteStream(filePath);
  https.get(url, (res) => {
    res.on('data', (chunk) => {
      stream.write(chunk);
    });
    res.on('end', () => {
      stream.end();
      callback && callback(filePath);
    });
  });
}
const download = function(url, output, fileName) {
  return new Promise(resolve => {
    _download(url, output, fileName, resolve);
  });
}

// 读 json
function readJson(url) {
  if (!fs.existsSync(url)) throw new Error('文件不存在');
  if (!/\.json$/i.test(url)) throw new Error('链接不是 json 文件');
  let str = fs.readFileSync(url, 'utf8');
  try {
    return JSON.parse(str);
  } catch(e) { throw e; }
}

// 写 json
function writeJson(url, data) {
  if (!/\.json$/i.test(url)) throw new Error('链接不是 json 文件');
  try {
    var str = JSON.stringify(data);
    fs.writeFileSync(url, str);
  } catch(e) { throw e; }
}

// 获取文本名（不妙）
function getFileName(filePath) {
  return filePath.split(/[\/\\]/).slice(-1)[0];
}

// 获取可用的链接
async function getLocalPath(url, dir = __dirname) {
  let filePath = url;
  const isAbsolutePath = /^[A-Z]\:/i.test(filePath);
  const isUrl = /https?:/i.test(filePath);
  if (isUrl) {
    const tempDir = fs.realpathSync(require('os').tmpdir());
    filePath = path.join(tempDir, getFileName(url));
    await download(url, filePath);
  } else if (isAbsolutePath) {
    filePath = filePath;
  } else {
    filePath = path.join(dir, url);
  }
  return filePath;
}

// 获取本地或远程文件的文本内容
async function getUrlContent(url, dir) {
  const isUrl = /https?:/i.test(url);
  let filePath = await getLocalPath(url, dir);
  const res = fs.readFileSync(filePath, 'utf8');
  isUrl && fs.unlinkSync(filePath); // 是远程的得删掉临时文件
  return res;
}

// 补零
function addZero(num, len = 2) {
  let numLen = (num + '').length;
  while (numLen++ < len) num = '0' + num;
  return num + '';
}

// 使用函数结果缓存
function useCache(fn) {
  var cache = {};
  return function(){
    var key = arguments.length + Array.prototype.join.call(arguments, ",");
    if (key in cache) return cache[key];
    else return cache[key] = fn.apply(this, arguments);
  }
}

// [{a:1},{a:2}], 'a' => [1,2]
function dataToArray(data, key, options) {
  if (typeOf(data) !== 'array' || !data.length) return [];
  if (!key) throw new Error('第二位入参有误');

  options = options || {};
  var noEmpty = options.noEmpty || false; // 排除值为空的
  var deepKey = options.deepKey || ''; // 按某 key 向下递归

  return data.reduce(function (re, item) {
    var value = item[key],
      deep = [];
    if (noEmpty && value == undefined) return re;
    if (deepKey) {
      var child = typeOf(item) === 'array' ? item : item[deepKey];
      deep = dataToArray(child, key, options);
    }
    return re.concat([value], deep);
  }, []);
}

module.exports = {
  typeOf,
  emptyDirSync,
  removeDirSync,
  makeDirSync,
  download,
  readJson,
  writeJson,
  getFileName,
  getLocalPath,
  getUrlContent,
  addZero,
  useCache,
  dataToArray
}
module.exports.default = module.exports;