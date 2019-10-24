const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { makeDirSync, getFileName } = require('../utils/index');
const { hasDownload, convertName } = require('../utils/me');
require('../consoleColor');

/**
 * 有些影片不好看，或损坏严重又暂无法替代，占用了较多内存
 * 因此将这些文件删除，以 txt 文件代替，这样依旧可以查询到，保持不会重复下载
 * 1. 存在则删除某视频文件，生成同名 txt 文件
 * 2. 批量处理某文件夹，使其全部完成上述操作
*/

const outputPath = 'F:/下载过';
const has = hasDownload();

const args = process.argv.slice(2);
removeThis(args[0], args[1] || outputPath);

function removeThis(name, outputPath) {
  makeDirSync(outputPath);
  // 找到的同名结果
  const hasList = has.filter(({ name: n }) => {
    return n.includes(name) || n.toLowerCase().includes(name);
  });

  // 无同名文件，
  if (hasList.length < 1) {
    const url = path.join(outputPath, name + '.txt');
    return replaceMp4ToTxt(url);
  }

  (async function loop(list, index) {
    const item = list[index];
    if (!item) return;
    const sure = await ask(item.url);
    if (sure) {
      replaceMp4ToTxt(item.url);
      loop(list, ++index);
    } else process.exit(0);
  })(hasList, 0);
}

// 将文件转为 txt 格式，如果文件还是视频则删除它
function replaceMp4ToTxt(url) {
  let name = getFileName(url);
  name = convertName(name);
  name = name.replace(/\..*/, '.txt');
  const output = path.join(outputPath, name);

  if (fs.existsSync(url) && !/\.txt$/.test(url)) {
    fs.unlinkSync(url);
    console.log(url, '存在，并', '删除成功'.red);
  }

  fs.writeFileSync(output, '', 'utf8');
  console.log('从'.yellow, url, '到'.yellow, output, '转换成功'.green);
  console.log('\n');
}

// 询问
async function ask(url) {
  const { sure } = await inquirer.prompt([{
    type: 'list',
    name: 'sure',
    choices: [
      { label: true, value: true },
      { label: false, value: false },
    ],
    message: `确定修改文件（${url}）`
  }]) || {};
  return sure;
}