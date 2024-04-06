import fs from 'fs-extra';
import inquirer from 'inquirer';
import { throwError } from '../../utils/others.mjs';
import run from './index.mjs';

/**
 * 预览该文件夹下所有图片
 */

const inputDir = process.argv[2];

const ask = async () => {
  if (inputDir) return inputDir;
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'dir',
      message: '要预览的文件夹：',
    },
  ]);
  const { dir } = result || {};
  return dir;
};

const entry = async () => {
  const dir = await ask();
  if (!dir || !fs.existsSync(dir)) throwError(`文件夹【${dir}】不存在`);

  run(dir);
};

entry();
