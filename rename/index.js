const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
require('../consoleColor');

/**
 * 将文件全部重命名为 ABCadd001 格式
 */

inquirer.prompt([{
  type: "input",
  name: "folder",
  message: "进行重命名的文件夹"
}]).then(res => {
  rename(res.folder);
});
// rename('I:/有码');

function rename(filePath) {
  const fileNames = fs.readdirSync(filePath, "utf-8");
  const join = (name) => path.join(filePath, name);

  const countTemp = {};
  (function loop(index) {
    var name = fileNames[index];
    if (!name) return console.log(filePath, 'finish');

    // 获得新名称
    const newName = name.replace(/([a-zA-Z0-9]+)(add|\-)(\d+)([-_]\w|[a-zA-Z])?/, (str, pre, add, num, unit) => {
      if (pre.length >= 5) pre = pre.replace(/(DB|HD|BD)$/i, '');
      let newStr = pre.toUpperCase() + 'add' + addZero(num, 3);

      // 没后缀的直接过
      if (!unit) return newStr;

      // 有后缀比如 _1 -0 a 等的都根据同名文件个数转为 A B
      const count = (countTemp[newStr] || 0) + 1;
      unit = String.fromCharCode(((count + '').codePointAt() + 16))
      countTemp[newStr] = count;
      return newStr + unit;
    });

    // 无需重命名的直接跳过
    console.log(name === newName ? '同'.green : '异'.red, '   ', name.padEnd(18, ' '), newName);
    if (name === newName) return loop(++index);

    // 开始重命名
    fs.rename(join(name), join(newName), err => {
      if (err) throw err;
      loop(++index);
    });
  })(0);

  function addZero(num, len = 2) {
    let numLen = (num + '').length;
    while (numLen++ < len) num = '0' + num;
    return num + '';
  }
}