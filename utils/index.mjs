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
    if (loaded < total) return loop();
    resolve(result);
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



