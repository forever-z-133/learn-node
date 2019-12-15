const inquirer = require('inquirer');
const {
  exec,
  spawn
} = require('child_process');

const [txt = 'hello', title = 'title'] = process.argv.slice(2);

(async () => {
  const type = await chooseType();
  switch (type) {
    case 'vb':
      return vbAlert(txt, title);
    case 'axo':
      return axoAlert(txt, title);
    case 'msg':
      return msgAlert(txt, title);
    case 'et':
      return etAlert(txt, title);
    default:
      throw new Error('没有这个案例');
  }
})();

// 选择哪种弹窗
async function chooseType() {
  const answer = await inquirer.prompt([{
    type: 'list',
    name: 'type',
    message: '选择弹窗形式',
    choices: [{
      name: 'VB 脚本',
      value: 'vb'
    }, {
      name: 'ActiveXObject',
      value: 'axo'
    }, {
      name: 'msg.exe',
      value: 'msg'
    }, {
      name: 'Electron',
      value: 'et'
    }]
  }]);
  return answer.type;
}

// VB 脚本的弹窗
function vbAlert(txt, title) {
  const fs = require('fs');
  const vbsFilePath = require('path').join(__dirname, 'temp.vbs');
  const command = `msgbox "${txt}", vbOKOnly, "${title}"`;
  fs.writeFileSync(vbsFilePath, command);
  exec(vbsFilePath, () => {
    fs.unlinkSync(vbsFilePath);
  });
}

// ActiveXObject 的弹窗
function axoAlert(txt, title) {
  const command = `mshta "javascript: var sh=new ActiveXObject("WScript.Shell"); sh.Popup("${txt}", 10, "${title}", 64); close(); "`;
  exec(command);
}

// msg.exe 的弹窗，有的系统没有此方法
function msgAlert(txt, title) {
  exec(`msg * "${txt}"`);  // 没办法设标题
  // spawn('cmd.exe', ['/c', `msg * "${txt}"`]);
}

// Electron 的弹窗，体积较大
function etAlert(txt, title) {

}