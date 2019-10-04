const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

/**
 * 看我电脑上是否存在这部影片
 */

// 获取这四个文件夹里的所有文件名
var dirs = ['F:\下载', 'F:\下载3', 'I:\无码', 'I:\有码'];
const fileNames = dirs.reduce((re, dir) => {
  let names = fs.readdirSync(dir) || [];
  names = names.map(name => {
    return {
      fileName: name.split('.')[0],
      filePath: path.resolve(dir, name).replace(/\\/g, '/'),
    }
  })
  return re.concat(names) ;
}, []);

// 开始动作，递归询问并打印结果
(function loop() {
  ask(name => {
    const item = find(name);
    item ? console.log(name, item.filePath) : console.log('没找到');
    loop();
  });
})();

// 是否存在 XXXadd123 或 xxx-123 这些番号
function find(name) {
  if (!name) return null;
  name = name.replace(/(.*?)(add|\-)(.*)/, (match, pre, add, next) => {
    return pre.toUpperCase() + 'add' + next.toUpperCase();
  });
  return fileNames.filter(item => {
    return item.fileName.includes(name);
  })[0];
}

// cmd 交互询问查哪个
function ask(callback) {
  inquirer.prompt([{
    type: "input",
    name: "name",
    message: "你要找哪个番号"
  }]).then(({ name }) => {
    callback && callback(name);
  });
}