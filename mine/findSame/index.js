const { hasDownload } = require("../../utils/me");

/*
 * 检查已下载视频中有没有相同番号
 */
(async function () {
  const codeMap = {};
  const sameResult = [];

  // 获取已下载的番号列表
  const has = await hasDownload();

  // 同名番号放入 sameResult 中
  has.forEach(item => {
    const { name, url } = item;
    // console.log('番号', name);
    const endWithChar = /[a-zA-Z]$/.test(name);
    if (endWithChar) {
      // 以字母结尾的直接匹配
      sameResult.push(url);
    } else if (codeMap.hasOwnProperty(name)) {
      // 如果有相同番号，则都匹配

    } else {

    }
  })
  console.log(sameResult);
})();
