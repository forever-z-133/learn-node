import inquirer from 'inquirer';
import run from './index.mjs';

const inputName = process.argv[2];

const entry = async () => {
  const name = inputName || await ask();

  name && run(name);
};

const ask = async () => {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '你要删除的番号：',
    },
  ]);
  const { name } = result || {};
  return name;
};

entry();
