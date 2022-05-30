
/**
 * 判断类型
 * @param {Any} obj 任何数据
 * @returns string
 */
export const typeOf = obj => {
  const typeStr = Object.prototype.toString.call(obj).split(' ')[1];
  return typeStr.slice(0, typeStr.length - 1).toLowerCase();
}

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
}

/**
 * 延时等待
 * @param {Number} delay 等待时长，单位 ms
 * @returns undefined
 */
export const sleep = (delay = 1000, cb) => new Promise(resolve => {
  setTimeout(() => {
    cb && cb();
    resolve();
  }, delay)
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
}

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
  }

  const loop = () => {
    count += 1;
    if (count >= total) return;
    const index = count;
    const item = list[index];
    func(item, index, next(index));
    restThread -= 1;
    if (restThread > 0) loop();
  }

  loop();
});
