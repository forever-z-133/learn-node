const fs = require('fs');
const path = require('path');

// 类型判断
function typeOf(obj) {
  const typeStr = Object.prototype.toString.call(obj).split(' ')[1];
  return typeStr.substr(0, typeStr.length - 1).toLowerCase();
}

// 获取文件夹中的文件列表
function getFilesInDirSync(dir) {
  let files = [];
  try {
    files = fs.readdirSync(dir);
  } catch (err) { }
  return files;
}

// 递归出所有的文件夹
function forEachDir(dir, dirCallback, fileCallback) {
  let files = getFilesInDirSync(dir);
  files.forEach((file) => {
    let _path = path.join(dir, file);
    if (fs.statSync(_path).isDirectory()) {
      // 如果自己是文件夹，则先继续递归，然后再处理自身
      forEachDir(_path, dirCallback, fileCallback);
      dirCallback && dirCallback(_path);
    } else {
      fileCallback && fileCallback(_path);
    }
  });
}

// 清空文件夹
function emptyDirSync(dir) {
  forEachDir(
    dir,
    (_dir) => {
      fs.rmdirSync(url); // 递归删除文件夹
    },
    (_file) => {
      fs.unlinkSync(url); // 删除文件
    }
  );
}

// 删除文件夹
function removeDirSync(url) {
  emptyDirSync(url);
  fs.rmdirSync(url);
}

// 删除文件
function removeFileSync(url) {
  fs.existsSync(url) && fs.unlinkSync(url);
}

// 新建文件夹
function makeDirSync(dir) {
  !fs.existsSync(dir) && fs.mkdirSync(dir);
}

// 获取链接类型
function fileNetType(url) {
  if (/^https/.test(url)) return 'https';
  if (/^http/.test(url)) return 'http';
  return 'file';
}

// 下载文件
function _download(url, output, fileName, callback) {
  if (typeof fileName === 'function') {
    callback = fileName;
    fileName = null;
  }
  fileName = fileName || getFileName(url);
  if (!fileName) throw new Error('没找到文件名');
  let filePath = path.join(output);
  if (filePath.lastIndexOf(fileName) < 0) {
    filePath = path.join(output, fileName);
  }
  const stream = fs.createWriteStream(filePath);
  ajax(url, 'get', (res) => {
    res.on('data', (chunk) => {
      stream.write(chunk);
    });
    res.on('end', () => {
      stream.end();
      callback && callback(filePath);
    });
    res.on('error', () => {
      _download(url, output, fileName, callback);
    });
  });
}
const download = function (url, output, fileName) {
  return new Promise((resolve) => {
    _download(url, output, fileName, resolve);
  });
};

// 读 json
function readJson(url) {
  if (!fs.existsSync(url)) throw new Error('文件不存在');
  if (!/\.json$/i.test(url)) throw new Error('链接不是 json 文件');
  let str = fs.readFileSync(url, 'utf8');
  try {
    return JSON.parse(str);
  } catch (e) {
    throw e;
  }
}

// 写 json
function writeJson(url, data) {
  if (!/\.json$/i.test(url)) throw new Error('链接不是 json 文件');
  try {
    var str = JSON.stringify(data);
    fs.writeFileSync(url, str);
  } catch (e) {
    throw e;
  }
}

// 获取文本名（不妙）
function getFileName(filePath) {
  filePath = filePath.replace(/[?#].*/, '');
  return filePath.split(/[\/\\]/).slice(-1)[0];
  // return filePath.slice(filePath.lastIndexOf('/') + 1);
}

function ajax(url, method = 'get', callback) {
  const netType = fileNetType(url);
  const ajax = netType === 'https' ? require('https') : require('http');
  return ajax[method](url, callback);
}

// 补零
function addZero(num, len = 2) {
  let numLen = (num + '').length;
  while (numLen++ < len) num = '0' + num;
  return num + '';
}

// 读取文件(本地&网络)
function readFile(url, callback) {
  return new Promise((resolve) => {
    const netType = fileNetType(url);
    if (netType === 'https' || netType === 'http') {
      ajax = netType === 'https' ? require('https') : require('http');
      ajax.get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          const result = body.toString('utf8');
          callback && callback(result);
          resolve(result);
        });
      });
    } else {
      const result = fs.readFileSync(url).toString('utf8');
      callback && callback(result);
      resolve(result);
    }
  });
}

// 使用函数结果缓存
function useCache(fn) {
  var cache = {};
  return function () {
    var key = arguments.length + Array.prototype.join.call(arguments, ',');
    if (key in cache) return cache[key];
    else return (cache[key] = fn.apply(this, arguments));
  };
}

// dataToArray([{a:1},{a:2}], 'a') => [1,2]
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

// dataToObject([{id:1,x:'a'}, {id:2,x:'b'}], 'id', 'x'); // {1:'a',2:'b'}
function dataToObject(data, keyName, valueName, options) {
  if (typeOf(data) !== 'array' || !data.length) return [];
  options = options || {};
  return data.reduce(function (re, item, index) {
    var key = keyName ? item[keyName] : index;
    var value = valueName ? item[valueName] : item;
    re[key] = value;
    return re;
  }, {});
}

// a=1&b=2 转为 {a:1,b:2}
function stringToObject(str, divide, concat) {
  if (!str || typeof str !== 'string') return {};
  divide = divide || '&';
  concat = concat || '=';
  var arr = str.split(divide);
  return arr.reduce(function (re, item) {
    if (!item) return re;
    var temp = item.split(concat);
    var key = temp.shift().trim();
    var value = temp.join(concat).trim();
    if (!key) return re;
    if (['null', 'undefined'].indexOf(value) > -1) value = undefined;
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    re[key] = value;
    return re;
  }, {});
}

// {a:1,b:2} 转为 a=1&b=2
function objectToString(obj, divide = '&', concat = '=') {
  if (!obj || typeof obj !== 'object') return '';
  let result = [];
  for (const key in obj) {
    if ({}.hasOwnProperty.call(obj, key)) {
      let val = obj[key];
      if (val === undefined || val == null) val = '';
      result.push(encodeURIComponent(key) + concat + encodeURIComponent(val));
    }
  }
  return result.join(divide);
}

// 给链接添加参数
// addDataToUrl('x.html?a=1', {b:2}) // x.html?a=1&b=2
function addDataToUrl(url, data) {
  if (!data) return url;

  const concat = /\?/.test(url) ? '&' : '?';

  if (typeof data === 'string') {
    return url + concat + data;
  } else if (typeOf(data) === 'object') {
    return url + concat + objectToString(data);
  } else {
    throw new Error('入参有误');
  }
}

// 异步循环
function forEachAsync(data, func, options) {
  options = options || {};
  const timesConfig = Math.min(options.number || 5, 8); // 最大线程数
  const total = data.length - 1;
  const result = [];

  let restQueue = timesConfig; // 剩余队列数
  let started = 0; // 已发起
  let loaded = 0; // 已完成
  (function loop(index) {
    const item = data[index];
    if (!item) return;
    func(index, item, (res) => {
      restQueue++;
      result[index] = res;
      if (++loaded > total) return finish(result);
      loop(++started);
    });
    if (--restQueue > 0) loop(++started);
  })(0);

  // 全部运行完成
  function finish(result) {
    options.finish && options.finish(result);
  }
}

// 深度遍历
function forEachDeep(obj, childKey, callback) {
  for (let key in obj) {
    const item = obj[key];
    if (key === childKey && item) {
      if (Array.isArray(item) || typeOf(child) === 'object') {
        forEachDeep(item, childKey, callback);
      }
    } else {
      callback && callback(item, key, obj);
    }
  }
}

module.exports = {
  typeOf,
  forEachDir,
  getFilesInDirSync,
  emptyDirSync,
  removeFileSync,
  removeDirSync,
  makeDirSync,
  fileNetType,
  download,
  readJson,
  writeJson,
  getFileName,
  readFile,
  addZero,
  useCache,
  dataToArray,
  dataToObject,
  stringToObject,
  objectToString,
  addDataToUrl,
  forEachAsync,
  forEachDeep,
};
module.exports.default = module.exports;
