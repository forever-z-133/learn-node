const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { getFileName } = require('../utils');
const { convertName, find } = require('../utils/me');

// npm run find -- G:\TDDOWNLOAD\种子\吉川爱美.txt
// npm run find -- G:\TDDOWNLOAD\种子\泷川索菲亚滝川ソフィアTAKIGAWA SOFIA.txt

// 正式开始
ask(url => {
	const txt = fs.readFileSync(url, "utf-8");

	// 将每行链接转为对象，key 为番号，value 为链接
	const links = txt.match(/magnet:?[^\n]+/g, '');
	const will = links.reduce((re, link) => {
		// TODO: 这个正则还有问题，需改
		let name = (link.match(/(\w+|\d+)[\-\_]\w*\d+/g) || [])[0];
		if (!name) throw new Error('问题链接：' + link);
		name = convertName(name);
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
	fs.writeFileSync(outputPath, result.join(''), 'utf8');
	console.log('已导出到桌面');
});

// 获取 txt 文件路径
function ask(callback) {
	const args = process.argv.slice(2);
	if (args.length > 0) {
		return callback && callback(args.join(' '), 'args');
	}
  inquirer.prompt([{
    type: "input",
    name: "url",
    message: "想要读取的种子路径"
  }]).then(({ url }) => {
    callback && callback(url);
  });
}