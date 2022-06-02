import fs from 'fs-extra';
import inquirer from 'inquirer';
import { throwError } from '../../utils/others.mjs';
import run from './index.mjs';

let inputDir = process.argv[2];
let inputFlags = process.argv[3];
if (inputFlags && inputFlags.trim().length) {
  inputFlags = inputFlags.trim().split(',');
}

if (inputDir && !inputFlags && !/^[C-H]:\\/.test(inputDir)) { // 兼容只传了 flags 的情况
  inputFlags = inputDir.trim().split(',');
  inputDir = undefined;
}

const askForDir = async () => {
  if (inputDir) return inputDir;
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
  if (inputFlags) return inputFlags;
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
