import inquirer from 'inquirer';
import run from './index.mjs';

export const ALERT_TYPES = {
  VB: 'vb',
  ActiveXObject: 'axo',
  MsgExe: 'msg',
  Electron: 'et',
};

const entry = async () => {
  const type = await ask();
  run(type);
};

async function ask() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: '选择弹窗形式',
      choices: [
        {
          name: 'VB 脚本',
          value: ALERT_TYPES.VB,
        },
        {
          name: 'ActiveXObject',
          value: ALERT_TYPES.ActiveXObject,
        },
        {
          name: 'msg.exe',
          value: ALERT_TYPES.MsgExe,
        },
        {
          name: 'Electron',
          value: ALERT_TYPES.Electron,
        }
      ]
    }
  ]);
  return answer.type;
}

entry();
