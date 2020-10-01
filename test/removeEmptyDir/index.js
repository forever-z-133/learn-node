const fs = require('fs');
const inquirer = require('inquirer');
const { forEachDir, getFilesInDirSync } = require('../../utils/index.js');

/**
 * 清除空的文件夹
 */
(async function () {
  // 询问要处理的文件夹
  let [dir] = process.argv.slice(2);
  if (!dir) dir = await askDir();

  // 递归此处的所有文件夹
  forEachDir(dir, (item) => {
    // 如果是空文件夹，则删除该空文件夹
    const files = getFilesInDirSync(item);
    if (files.length < 1) {
      fs.rmdirSync(item);
      console.log('删除：', item);
    }
  });

  console.log('finish');
})();

// 询问处理哪个文件夹
function askDir(callback) {
  const question = [{ type: 'input', name: 'dir', message: '处理哪个文件夹' }];
  return inquirer.prompt(question).then(({ dir }) => {
    callback && callback(dir);
    return dir;
  });
}
