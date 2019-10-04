const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { getFileName } = require('../utils');

// npm run find -- G:\TDDOWNLOAD\种子\吉川爱美.txt

// 获取已下载了的番号
const dirs = ['F:\下载', 'F:\下载3', 'I:\无码', 'I:\有码'];
const has = dirs.reduce((re, dir) => {
  let names = fs.readdirSync(dir) || [];
  names = names.map(name => {
    return {
      fileName: name.split('.')[0],
      filePath: path.resolve(dir, name).replace(/\\/g, '/'),
    }
  })
  return re.concat(names) ;
}, []);

// 正式开始
ask(url => {
	const txt = fs.readFileSync(url, "utf-8");

	// 将每行链接转为对象，key 为番号，value 为链接
	const links = txt.match(/(^(?:magnet).+$)/gm, '');
	const will = links.reduce((re, link) => {
		let name = link.match(/\w+[-_]\d+/g)[0];
		name = name.replace(/(.*?)(add|\-)(.*)/, (match, pre, add, next) => {
			return pre.toUpperCase() + 'add' + next.toUpperCase();
		});
		re[name] = link;
		return re;
	}, {});

	// 看已下载中有没有，没有则将链接存入 result 等待导出
	const result = [];
	for (let name in will) {
		const item = find(name);
		if (item) continue;
		const link = will[name];
		console.log(name, link);
		result.push(link);
	}

	// 开始导出
	// console.log(result);
	const fileName = getFileName(url);
	const outputPath = path.join('C:/Users/DELL/Desktop/', fileName);
	fs.writeFileSync(outputPath, result.join('\r\n'), 'utf8');
	console.log('已导出到桌面');
});

// 获取 txt 文件路径
function ask(callback) {
	const args = process.argv.slice(2);
	if (args.length > 0) {
		return callback && callback(args[0]);
	}
  inquirer.prompt([{
    type: "input",
    name: "url",
    message: "想要读取的种子路径"
  }]).then(({ url }) => {
    callback && callback(url);
  });
}

// 从已下载中找到相应番号
function find(name) {
  if (!name) return null;
  name = name.replace(/(.*?)(add|\-)(.*)/, (match, pre, add, next) => {
    return pre.toUpperCase() + 'add' + next.toUpperCase();
  });
  return has.filter(item => {
    return item.fileName.includes(name);
  })[0];
}