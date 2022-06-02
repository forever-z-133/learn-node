import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';
import { getThisDir } from '../../utils/paths.mjs';
import { ALERT_TYPES } from './entry.mjs';

const thisPath = getThisDir();

const run = (type = ALERT_TYPES.VB) => {
  const [title = 'title', content = 'hello',] = process.argv.slice(2);

  switch (type) {
    case ALERT_TYPES.VB: return vbAlert(content, title);
    case ALERT_TYPES.ActiveXObject: return axoAlert(content, title);
    case ALERT_TYPES.MsgExe: return msgAlert(content, title);
    case ALERT_TYPES.Electron: return etAlert(content, title);
    default: throw new Error('没有这个案例');
  }
};

// VB 脚本的弹窗
function vbAlert(content, title) {
  const vbsFilePath = path.join(thisPath, 'temp.vbs');
  const command = `msgbox "${content}", vbOKOnly, "${title}"`;
  fs.writeFileSync(vbsFilePath, command);
  spawn.sync(vbsFilePath);
  fs.unlinkSync(vbsFilePath);
}

// ActiveXObject 的弹窗
function axoAlert(content, title) {
  const command = `mshta "javascript: var sh=new ActiveXObject("WScript.Shell"); sh.Popup("${content}", 10, "${title}", 64); close(); "`;
  spawn.sync(command);
}

// msg.exe 的弹窗，有的系统没有此方法
function msgAlert(content, title) {
  title;
  spawn.sync(`msg * "${content}"`); // 没办法设标题
}

// Electron 的弹窗，体积较大
function etAlert(content, title) {
  content;
  title;
  console.log('未实现');
}

export default run;
