import fs from 'fs-extra';
import inquirer from 'inquirer';
import { throwError } from '../../utils/others.mjs';
import run from './index.mjs';

const askForDir = async () => {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'dir',
      message: '要处理的文件夹：',
    },
  ]);
  const { dir } = result || {};
  return dir;
};

const askForFlags = async () => {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'flags',
      message: '有此文件标记的文件将删除：',
    },
  ]);
  const { flags: f } = result || {};
  const flags = f && f.trim().length ? f.split(',') : [];
  return flags;
};

const entry = async () => {
  const dir = await askForDir();
  if (!dir || !fs.existsSync(dir)) throwError(`文件夹【${dir}】不存在`);

  const flags = await askForFlags();
  if (!flags.length) throwError('文件标记不能为空，请以 [,] 符号分割');

  run(dir, flags);
};

entry();
