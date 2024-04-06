import inquirer from 'inquirer';
import run from './index.mjs';

/**
 * 将该文件中的所有子文件抽离到最上层
 * yarn command expand E:\下载3 .mp4,.rmvb
 */

const inputName = process.argv[2];
const inputTypes = process.argv[3];

const entry = async () => {
  const name = inputName || await askForName();
  const types = inputTypes || await askForTypes();

  name && run(name, types);
};

const askForName = async () => {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '将该文件中的所有子文件抽离到最上层：'
    },
  ]);
  const { name } = result || {};
  return name;
};

const askForTypes = async () => {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'types',
      message: '要处理的文件类型（用,隔开）：'
    },
  ]);
  const { types } = result || {};
  return types;
};

entry();
