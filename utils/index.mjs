
/**
 * 判断类型
 * @param {Any} obj 任何数据
 * @returns string
 */
export const typeOf = obj => {
  const typeStr = Object.prototype.toString.call(obj).split(' ')[1];
  return typeStr.slice(0, typeStr.length - 1).toLowerCase();
};

/**
 * 判断是否为数字字符串
 * @param {String} str 字符串
 * @returns boolean
 */
export const isNumberString = str => {
  return parseInt(str, 10).toString() === str;
};

/**
 * 补零
 * @param {Number} num 数字
 * @param {Number} len 长度
 * @returns number
 */
export const addZero = (num, len = 2) => {
  let result = isNaN(num) ? '' : (num + '');
  let numLen = result.length;
  while (numLen++ < len) result = '0' + result;
  return result;
};

/**
 * 延时等待
 * @param {Number} delay 等待时长，单位 ms
 * @returns undefined
 */
export const sleep = (delay = 1000, cb) => new Promise(resolve => {
  setTimeout(() => {
    cb && cb();
    resolve();
  }, delay);
});

/**
 * 根据循环方法将数组拆为两份，符合的放前面
 * @param {*} array 数组
 * @param {*} callback 循环方法
 * @returns array
 */
export const divideArray = (array, callback) => {
  const template = [[], []];
  if (!callback || typeOf(callback) !== 'function') return template;
  return array.reduce((res, item, index) => {
    const match = callback(item, index);
    match ? res[0].push(item) : res[1].push(item);
    return res;
  }, template);
};

/**
 * 键值对字符串转为对象
 * a=1&b=2 转为 {a:'1',b:'2'}
 * @param {String} str 源字符串
 * @param {String} divide 键值对分割符
 * @param {String} concat 键值对赋值符
 * @returns object
 */
export const stringToObject = (str, divide = '&', concat = '=') => {
  if (!str || typeof str !== 'string') return {};

  const array = str.split(divide);
  const result = {};

  array.forEach(item => {
    if (!item) return;

    const temp = item.split(concat);
    const key = decodeURIComponent(temp.shift().trim());
    let value = decodeURIComponent(temp.join(concat).trim());

    if (!key) return;

    if (['null', 'undefined'].includes(value)) value = undefined;
    if (value === 'true') value = true;
    if (value === 'false') value = false;

    result[key] = value;
  });

  return result;
};

/**
 * 对象转为键值对字符串
 * {a:'1',b:'2'} 转为 a=1&b=2
 * @param {Object} obj 对象
 * @param {String} divide 键值对分割符
 * @param {String} concat 键值对赋值符
 * @returns string
 */
export const objectToString = (obj, divide = '&', concat = '=') => {
  if (!obj || typeof obj !== 'object') return '';
  const result = [];
  Object.keys(obj).forEach(key => {
    let val = obj[key];
    result.push(encodeURIComponent(key) + concat + encodeURIComponent(val));
  });
  return result.join(divide);
};

/**
 * 给链接加上参数
 * @param {String} url 链接
 * @param {String|Object} data 参数
 * @returns string
 */
const uselessUrlSearchReg = /[?#]\B/g; // 单独的无用的 ? 和 # 符
export const addDataToUrl = (url, data) => {
  const result = url.replace(uselessUrlSearchReg, '');
  if (!data) return result;

  const concat = result.includes('?') ? '&' : '?';

  if (typeof data === 'string') {
    return result + concat + data;
  } else if (typeOf(data) === 'object') {
    return result + concat + objectToString(data);
  }
  return result;
};

/**
 * 连字符转驼峰
 * 比如 font-size 返回 fontSize
 * @param {String} str 字符串
 * @returns string
 */
export const camelize = str => {
  if (!str || typeof str !== 'string') return '';
  return str.toLowerCase().replace(/-(\w)/g, (_, s) => s.toUpperCase());
};

/**
 * 对象中的 key 转为驼峰
 * 比如 {'font-size':1} 返回 {fontSize:1}
 * @param {Object} obj
 * @returns object
 */
export const camelizeKeys = obj => {
  const result = {};
  if (!obj) return result;
  Object.keys(obj).forEach(k => {
    const key = camelize(k);
    result[key] = obj[k];
  });
  return result;
};

/**
 * 去掉路径中参数，比如 x.js?t=1 返回 x.js
 * @param {String} url
 * @returns string
 */
export const getPureUrl = url => {
  if (!url || typeof url !== 'string') return '';
  return url.split(/\?|#/)[0];
};

/**
 * 异步多线程
 * 通常用于同时发起请求，并控制并行的请求数量
 *
 * @param {Array} list 列表数据
 * @param {Function} func 循环方法
 * @param {Object} options 配置
 * @returns undefined
 *
 * Example:
 * const array = new Array(8).fill();
 * const forEachCallback = (_, index, next) => {
 *   setTimeout(() => next(index), Math.random() * 200);
 * }
 * forEachAsync(array, forEachCallback).then(console.log); // [0,1,2,3,4,5,6,7]
 */
export const forEachAsync = (list, func, options) => new Promise(resolve => {
  const { thread: t = 5 } = options || {};
  const thread = Math.max(1, Math.min(8, t));
  const result = [];
  const total = list.length;
  let restThread = thread;
  let loaded = 0;
  let count = -1;

  const next = index => res => {
    loaded += 1;
    restThread += 1;
    result[index] = res;
    if (loaded < total) loop();
    else resolve(result);
  };

  const loop = () => {
    count += 1;
    if (count >= total) return;
    const index = count;
    const item = list[index];
    func(item, index, next(index));
    restThread -= 1;
    if (restThread > 0) loop();
  };

  loop();
});

/**
 * 将 json 中某个 key 转为 key map，通常用于后续查重
 * @param {Array} array json
 * @param {String} key json 中的 key
 * @returns object
 */
export const jsonToObject = (json, key = '') => {
  const result = {};
  json.forEach((item, index) => {
    const name = key ? item[key] : item;
    const value = key ? item : index;
    result[name] = value;
  });
  return result;
};
