const fs = require('fs');
const path = require('path');

/**
 * 将文件全部重命名为 ABCadd001 格式
 */

rename('I:/无码');
rename('I:/有码');

function rename(filePath) {
  const fileNames = fs.readdirSync(filePath, "utf-8");
  const join = (name) => path.join(filePath, name);

  const countTemp = {};
  (function loop(index) {
    var name = fileNames[index];
    if (!name) return console.log(filePath, 'finish');

    const newName = name.replace(/([a-zA-Z0-9]+)(add|\-)(\d+)([-_]\w|[a-zA-Z])?/, (str, pre, add, num, unit) => {
      let newStr = pre.toUpperCase() + 'add' + addZero(num, 3);

      if (!unit) return newStr;

      const count = (countTemp[newStr] || 0) + 1;
      unit = String.fromCharCode(((count + '').codePointAt() + 16))
      countTemp[newStr] = count;
      return newStr + unit;
    });

    if (name === newName) return loop(++index);

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