const fs = require("fs");
const path = require("path");
const inquirer = require('inquirer');
const { removeFileSync, loopFindFile } = require("../../utils/index");

/// 输入文件夹和特征，删除该文件夹下所有相关文件
/// 比如 .bak .orig .DS_store 等文件
/// 但这是硬删除，没法找回的，所以最好先造个临时文件测验下再批处理
(async function () {
  let [dir] = process.argv.slice(2);
  if (!dir) dir = await askDir();
  const reg = await askReg();
  loopFindFile(dir, just_do_it(reg));
})();

/// 根据特征删除文件
function just_do_it(reg) {
  return (url) => {
    if (url.includes(reg)) {
      removeFileSync(url);
      console.log(`删除：${url}`);
    }
  }
}

/// 询问处理哪个文件夹
function askDir(callback) {
  const question = [{ type: 'input', name: 'dir', message: '处理哪个文件夹' }];
  return inquirer.prompt(question).then(({ dir }) => {
    callback && callback(dir);
    return dir;
  });
}
/// 询问删除哪些文件
function askReg(callback) {
  const question = [{ type: 'input', name: 'reg', message: '要删的文件有什么特征' }];
  return inquirer.prompt(question).then(({ reg }) => {
    callback && callback(reg);
    return reg;
  });
}