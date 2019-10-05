const inquirer = require('inquirer');
const { find } = require('../utils/me');
require('../consoleColor');

/**
 * 看我电脑上是否存在这部影片
 */

// 开始动作，递归询问并打印结果
(function loop() {
  ask((name, type) => {
    const item = find(name);
    item ? console.log(name, item.filePath) : console.log(name, '没找到');
    type !== 'args' && loop();
  });
})();

// cmd 交互询问查哪个
function ask(callback) {
	const args = process.argv.slice(2);
	if (args.length > 0) {
		return callback && callback(args.join(' '), 'args');
	}
  inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: '你要找哪个番号' + '（输入n回车可关闭）'.green
  }]).then(({ name }) => {
    if (name === 'n') process.exit(0);
    callback && callback(name);
  });
}