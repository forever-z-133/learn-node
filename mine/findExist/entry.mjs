import inquirer from 'inquirer';
import run from './index.mjs';
import '../../test/consoleColor/index.js';

const inputName = process.argv[2];

const entry = async () => {
  const name = inputName || await ask();

  if (name === 'n') return process.exit(0);

  run(name);
  !inputName && entry();
};

const ask = async () => {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '你要找哪个番号：' + '（输入n回车可关闭）'.green
    },
  ]);
  const { name } = result || {};
  return name;
};

entry();
