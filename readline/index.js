const readline = require('readline');
const inquirer = require('inquirer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const sleep = (delay) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

rl.question('你如何看待 Node.js 中文网？', async (answer) => {

  console.log(`感谢您的宝贵意见：${answer}`);

  rl.write('1s 后删除这行');

  await sleep(1000);

  // 模拟 Ctrl+u 删除先前写入的行。
  rl.write(null, { ctrl: true, name: 'u' });
  
  // 清空输入后的部分
  // rl.write('\033[0f');

  // 全部清空
  // rl.write('\033[2J');

  // rl.moveCursor(process.stdin, 0, 0);
  // rl.clearLine(process.stdin, 0);
  // rl.clearLine(process.stdout, 0);

  rl.close();
});