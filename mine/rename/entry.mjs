import inquirer from 'inquirer';
import run from './index.mjs';
import '../../test/consoleColor/index.js';

/**
 * yarn command E:\下载3
 */

const inputDir = process.argv[2];

const entry = async () => {
  const entryDir = inputDir || await ask();

  run(entryDir);
};

const ask = async () => {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'dir',
      message: '进行重命名的文件夹'
    },
  ]);
  const { dir } = result || {};
  return dir;
};

entry();

