const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { convertName, getFilesArray } = require('../../utils/me');
require('../../test/consoleColor');

/**
 * 将文件全部重命名为 ABCadd001 格式
 */

(async () => {
  let folder;
  [folder] = process.argv.slice(2);
  if (folder) {
    return rename(folder);
  } else {
    folder = await ask();
    rename(folder);
  }
})();

function rename(dir) {
  dir = path.resolve(dir);
  const filesArr = getFilesArray(dir);

  const tempSameName = {};
  const result = filesArr.reduce(
    (re, file) => {
      const { name } = file;
      const newName = convertName(name);
      const inner = tempSameName[newName] || [];
      if (inner && inner.length) {
        re.has.push({ file, newName, others: inner });
      } else if (name === newName) {
        re.same.push({ file, newName });
      } else {
        re.should.push({ file, newName });
      }
      tempSameName[newName] = [...inner, file];
      return re;
    },
    { has: [], same: [], should: [] }
  );

  result.same.forEach(({ file, newName }) => {
    const { url } = file;
    console.log('不变'.green, newName.padEnd(12, ' '), url);
  });

  result.should.forEach(({ file, newName }) => {
    const { unit, url, dir } = file;
    console.log('改变'.yellow, newName.padEnd(12, ' '), url);
    fs.renameSync(url, path.join(dir, `${newName}.${unit.toLowerCase()}`));
  });

  result.has.forEach(({ file, newName, others = [] }) => {
    const { url } = file;
    console.log('同名'.red, newName.padEnd(12, ' '), url, others.map(file => file.url).join(' '));
  });
}

async function ask() {
  const params = [
    {
      type: 'input',
      name: 'folder',
      message: '进行重命名的文件夹'
    }
  ];
  const { folder } = await inquirer.prompt(params);
  return folder;
}
