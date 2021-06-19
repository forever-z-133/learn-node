const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { getFileName, dataToArray, forEachAsync, removeFileSync } = require('../../utils');
const { matchName, convertName, hasDownload } = require('../../utils/me');
require('../../test/consoleColor');
const config = require('./config');

// npm run find -- all
// npm run find -- I:/种子/滨崎里绪浜崎りお森下えりか篠原絵梨香.txt

const has = hasDownload(); // 已下载的番号集合 [{ name, unit, url, dir }]
const tempHas = dataToArray(has, 'name'); // 已下载的番号 [name]

/// 主程序
const input = process.argv.slice(2).join(' ');
if (input === 'all') {
  const list = config.filter((v) => v.number).map((v) => v.path);
  forEachAsync(list, (i, url, next) => findNotDownload(url, next), {
    finish: (resArr) => resArr.forEach(controller),
  });
} else if (input) {
  findNotDownload(input, controller);
} else {
  ask((entry) => {
    findNotDownload(entry, controller);
  });
}

/// 获取下载情况后进行打印和缓存
function controller(res) {
  const { entry, doneArray, unDoneArray, errerLinks } = res;
  // 打印未下载的番号
  unDoneArray.forEach(({ name, link }) => {
    console.log(`${'未下载'.red}：${link}`);
  });
  // 打印结果
  if (unDoneArray.length < 1) console.log('此女优的番号都下载过了');
  else console.log(`${entry.blue} 还有 ${unDoneArray.length} 个番号未下载`);
  // 备份一个 txt 到桌面
  saveUnDoneAsTxt(entry, unDoneArray);
  // 修改 config 中的未下载数
  refreshUnDoneNumber(entry, unDoneArray.length);
}

/// 获取下载情况
function findNotDownload(entry, callback) {
  // 读取源 txt 文件，将每行链接转为对象
  const txt = fs.readFileSync(entry, 'utf-8');
  const links = txt.match(/magnet:\?[^\n]+/g);
  let doneArray = [];
  let unDoneArray = [];
  let errerLinks = [];

  // 获取需要下载的番号，错误番号放 errerLinks
  const will = links.reduce((re, link) => {
    let name = matchName(link);
    name = convertName(name);
    if (!name || re[name]) errerLinks.push({ name, link });
    else re[name] = link;
    return re;
  }, {});

  // 看已下载的中是否包含，包含表示已下载放在 doneArray，反之 unDoneArray
  for (let name in will) {
    const item = tempHas.filter((n) => n.includes(name))[0];
    const link = will[name];
    !!item ? doneArray.push({ name, link }) : unDoneArray.push({ name, link });
  }

  // 排个序，A 在前
  doneArray = doneArray.sort((a, b) => (a.name < b.name ? -1 : 1));
  unDoneArray = unDoneArray.sort((a, b) => (a.name < b.name ? -1 : 1));

  // 开始导出
  callback && callback({ entry, doneArray, unDoneArray, errerLinks });
}

/// 在桌面备份一个 txt 看哪些没下载
function saveUnDoneAsTxt(entry, unDoneArray) {
  const outputDir = 'C:/Users/61775/Desktop/种子';
  const outputPath = path.join(outputDir, getFileName(entry));
  if (unDoneArray.length < 1) return removeFileSync(outputPath);
  const newText = dataToArray(unDoneArray, 'link').join('\n');
  fs.writeFileSync(outputPath, newText, 'utf8');
}

/// 修改 config 中的未下载数
function refreshUnDoneNumber(entry, number) {
  config.forEach((item) => {
    if (item.path === entry) {
      if (item.number !== number) console.log(`${entry.blue} 下载数由 ${item.number} 变为 ${number}`);
      item.number = number;
    }
  });
  const configPath = path.join(__dirname, 'config.js');
  const newText = `module.exports = ${JSON.stringify(config, null, '  ')};\n`;
  fs.writeFileSync(configPath, newText, 'utf8');
}

/// 获取 txt 文件路径
function ask(callback) {
  const question = [{ type: 'input', name: 'url', message: '想要读取的种子路径' }];
  inquirer.prompt(question).then(({ url }) => {
    callback && callback(url);
  });
}
