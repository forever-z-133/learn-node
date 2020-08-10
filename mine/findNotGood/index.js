const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { makeDirSync } = require('../../utils/index');
const { hasDownload, convertName } = require('../../utils/me');
require('../../test/consoleColor');

/**
 * 有些影片不好看，或损坏严重又暂无法替代，占用了较多内存
 * 因此将这些文件删除，以 txt 文件代替，这样依旧可以查询到，避免重复下载
 * 1. 查到已下载的同名，删除改视频文件，生成同名 txt 文件
 * 2. 批量处理某文件夹，使其全部完成上述操作
 * 
 * npm run remove -- snis-544
 */

const outputPath = 'I:/下载过';
makeDirSync(outputPath);

const args = process.argv.slice(2);
const name = args[0];

// 下载过并好看的
const hasList = hasDownload().filter(({ name: n, dir }) => {
  const match = n.includes(name) || n.toLowerCase().includes(name);
  return match && dir !== outputPath;
});
// 下载过并不好看的
const hasTxtList = hasDownload(outputPath).filter(({ name: n }) => {
  return n.includes(name) || n.toLowerCase().includes(name);
});

// 正式操作
const excludeList = [];
(async function loop() {
  const choices = getChoicesList(excludeList);

  const choose = await ask(choices);
  if (choose === 'cancel') process.exit(0);

  const [method, path] = choose.split(' ');
  if (method === 'remove') {
    excludeList.push(path);
    removeFile(path);
  } else if (method === 'create') {
    excludeList.push(path);
    createFile(path);
  }
  await loop();
})();

// 拼凑选择列表
function getChoicesList(exclude) {
  // 查到哪些同名文件，如要删的同名视频或要加的同名 txt 等
  const txtPath = getTxtPath(name);

  // 要删除的
  const removeList = hasList.reduce((re, { url }) => {
    if (exclude.includes(url)) return re;
    return re.concat([
      {
        name: `${'删除'.red}：${url}`,
        value: `remove ${url}`
      }
    ]);
  }, []);

  // 是否已新建过
  let alreadyHasTxt = hasTxtList.some(({ name: n, url }) => {
    const name2 = convertName(name);
    return n === name2 || n.toLowerCase === name2;
  });
  if (exclude.includes(txtPath)) {
    alreadyHasTxt = true;
  } else {
    alreadyHasTxt && console.log(`------ 已存在 ${txtPath.green} 无需新建\n`);
  }

  // 要新建的
  let createList = !alreadyHasTxt && {
    name: `${'新建'.green}：${txtPath}`,
    value: `create ${txtPath}`
  };
  createList = createList ? [createList] : [];

  return [...removeList, ...createList, { label: '退出', value: 'cancel' }];
}

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

// txt 的目标路径
function getTxtPath(name) {
  return path.join(outputPath, convertName(name) + '.txt').replace(/\\/g, '/');
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
