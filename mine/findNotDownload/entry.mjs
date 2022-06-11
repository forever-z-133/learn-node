import inquirer from 'inquirer';
import run from './index.mjs';
import '../../test/consoleColor/index.js';

const inputUrl = process.argv.slice(2).join(' ');

/**
 * 测试数据
 * yarn command find I:/种子/滨崎里绪浜崎りお森下えりか篠原絵梨香.txt
 */

const entry = async () => {
  const url = inputUrl || await ask();
  run(url);
};

const ask = async () => {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: '要排查的 txt 文件路径'
    },
  ]);
  const { url } = result || {};
  return url;
};

entry();
