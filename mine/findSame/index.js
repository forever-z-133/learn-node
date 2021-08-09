const { hasDownload } = require("../../utils/me");
require('../../test/consoleColor');

/*
 * 检查已下载视频中有没有相同番号
 */
(async function () {
  const endReg = /[A-E]$/i;
  const sameResult = {};

  // 获取已下载的番号列表
  let has = await hasDownload();
  // 排序后再前后对比，能更简洁地找出相同番号
  has = has.sort((a, b) => a.name > b.name ? 1 : -1);
  has.reduce((a, b) => {
    const n1 = a.name.replace(endReg, '');
    const n2 = b.name.replace(endReg, '');
    const length = Math.max(n1.length, n2.length);
    let sameCount = 0;
    for (let i = 0; i < length; i++) {
      if (n1[i] !== n2[i]) continue;
      sameCount++;
    }
    // 若存在相同长度的相同字母，那就是相同番号了
    if (sameCount === length) {
      if (!sameResult[n1]) sameResult[n1] = [];
      // 组成 { [name]: [url, url] } 的结构导出
      [a, b].forEach(item => {
        if (!sameResult[n1].includes(item)) {
          sameResult[n1].push(item);
        }
      });
    }
    return b;
  });

  Object.keys(sameResult).forEach(name => {
    const value = sameResult[name];
    // 排除掉末尾为 ABC 连号的番号
    const lastCharCode = value.reduce((re, e) => lastCharIsCode(e.name, re) ? re + 1 : re, 65);
    if (lastCharCode - 65 === value.length) return;
    // 打印剩下需要手动检测的重名番号
    console.group(name.green);
    console.log(value.map(e => e.url).join('\n'));
    console.groupEnd();
  });
})();

// 判断最后一位字母是不是特定号码，比如 A === 65
function lastCharIsCode(str, code) {
  const last = str[str.length - 1];
  const target = String.fromCodePoint(code);
  return last === target;
}
