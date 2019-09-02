const readline = require('readline');
const inquirer = require('inquirer');
const sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay));

// prompt 修改行首文本
// online 监听回车才算一行
// (() => {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     prompt: '请输入> '
//   });

//   rl.prompt();
//   setTimeout(() => {
//     // write 时跟手动输入差不多，和 console 是不同的
//     rl.write('hello\n');
//   }, 500);

//   rl.on('line', (line) => {
//     line = line.trim();
//     if (line.trim() === 'close') return rl.close();
//     switch (line.trim()) {
//       case 'hello':
//         console.log('world!');
//         break;
//       default:
//         console.log(`你输入的是：'${line.trim()}'`);
//         break;
//     }
//     rl.prompt();
//   }).on('close', () => {
//     console.log('再见!');
//     process.exit(0);
//   });
// })();

(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const questionAsync = (txt) => {
    return new Promise(resolve => {
      rl.question(txt, resolve);
    });
  }

  const answer = await questionAsync('确定开始跑进度吗？(Y/N)');
  const isYes = answer === '' || /y(es)?/i.test(answer)
  if (!isYes) {
    rl.write('\033[2J');
    return process.exit(0);
  }

  rl.write('开始删除\n');

  // 跑进度
  (async function loop(index, max) {
    if (index > max) return finish();
    await sleep(1e2);
    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 0);
    rl.write('loading... ' + Math.ceil(index/max*100) + '%');
    loop(++index, max);
  })(0, 10);

  // 跑完
  function finish() {
    readline.cursorTo(process.stdout, 0, 0);
    rl.write('\033[2J');
    rl.write('loading finish');
    process.exit(0);
  }

  // 清空输入后的部分
  // rl.write('\033[0f');

  // 全部清空
  // rl.write('\033[2J');

  // 模拟 Ctrl+u 删除先前写入的行。
  // rl.write(null, { ctrl: true, name: 'u' });

  // rl.close();
})();