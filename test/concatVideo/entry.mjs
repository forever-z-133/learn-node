import inquirer from 'inquirer';
import { throwError } from '../../utils/others.mjs';
import run from './index.mjs';

/**
 * yarn command concat
 * yarn command concat ask
 */

const inputFlags = process.argv[2];

const entry = async () => {
  const flags = await ask();
  run(flags);
};

const ask = async () => {
  if (!inputFlags || !inputFlags.trim().length) return '';
  if (inputFlags !== 'ask') throwError('请检查入参，仅支持无参或 ask');
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'flags',
      message: '视频名称：',
    },
  ]);
  const { flags } = result || {};
  return flags;
};

entry();
