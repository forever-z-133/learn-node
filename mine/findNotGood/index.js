const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { makeDirSync } = require('../../utils/index');
const { CodeFileItem, convertName, findSimilarNameFiles } = require('../../utils/me');
require('../../test/consoleColor');

/**
 * 有些影片不好看，或损坏严重又暂无法替代，占用了较多内存
 * 因此将这些文件删除，以 txt 文件代替，这样依旧可以查询到，避免重复下载
 * 1. 查到已下载的同名，删除改视频文件，生成同名 txt 文件
 * 2. 批量处理某文件夹，使其全部完成上述操作
 * 
 * npm run remove -- snis-544
 */

const outputPath = path.resolve('I:/下载过');
makeDirSync(outputPath);

const args = process.argv.slice(2);
const name = args[0];

// 正式操作
const excludeList = [];
(async function loop() {
  const similar = findSimilarNameFiles(name);

  const needDelete = []; // 要删的
  const needCreate = []; // 要加的
  const alreadyHas = []; // 已有的
  similar.forEach((item) => {
    const { url, dir } = item;
    if (dir === outputPath) alreadyHas.push(item);
    else if (!excludeList.includes(url)) needDelete.push(item);
  });
  const fileName = name + '.txt';
  const targetUrl = path.join(outputPath, fileName);
  if (!fs.existsSync(targetUrl)) {
    const item = new CodeFileItem(fileName, name, 'txt', outputPath, targetUrl);
    needCreate.push(item);
  }

  const choices = [];
  needDelete.forEach(({ url }) => {
    const opt = { value: `remove ${url}`, name: `${'删除'.red}：${url}` }
    choices.push(opt);
  });
  needCreate.forEach(({ name, unit }) => {
    const url = path.resolve(outputPath, name.toUpperCase() + '.' + unit);
    const opt = { value: `create ${url}`, name: `${'新建'.green}：${url}` }
    choices.push(opt);
  });
  alreadyHas.forEach(({ url }) => {
    console.log(`------ 已存在 ${url.green} 无需新建\n`);
  });
  choices.push({ label: '退出', value: 'cancel' });

  const choose = await ask(choices);
  if (choose === 'cancel') process.exit(0);

  const [method, url] = choose.split(' ');
  if (method === 'remove') {
    excludeList.push(url);
    removeFile(url);
  } else if (method === 'create') {
    excludeList.push(url);
    createFile(url);
  }
  await loop();
})();

// 询问
async function ask(choices) {
  const result = await inquirer.prompt([
    {
      type: 'list',
      name: 'choose',
      choices,
      message: `（${name}）`
    }
  ]);
  const { choose } = result || {};
  return choose;
}

// 删除文件
function removeFile(path) {
  if (!fs.existsSync(path)) return;
  fs.unlinkSync(path);
  console.clear();
  console.log(`------------ ${path} 删除成功\n`);
}

// 新建文件
function createFile(path) {
  fs.writeFileSync(path, '', 'utf8');
  console.clear();
  console.log(`------------ ${path} 新建成功\n`);
}
