const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { getFileName, dataToArray } = require('../utils');
const { convertName, hasDownload } = require('../utils/me');
require('../consoleColor');

// npm run find -- G:\TDDOWNLOAD\种子\吉川爱美.txt
// npm run find -- G:\TDDOWNLOAD\种子\泷川索菲亚滝川ソフィアTAKIGAWA SOFIA.txt
// npm run find -- G:\TDDOWNLOAD\种子\爱乃娜美爱乃なみNAMI AINO.txt
// npm run find -- G:\TDDOWNLOAD\种子\愛実れい爱实丽.txt
// npm run find -- G:\TDDOWNLOAD\种子\滨崎里绪浜崎りお森下えりか篠原絵梨香.txt
// npm run find -- G:\TDDOWNLOAD\种子\冲田杏梨沖田杏梨観月あかねAnnri Okita.txt
// npm run find -- G:\TDDOWNLOAD\种子\仁科百华仁科百華momoka nishina.txt
// npm run find -- G:\TDDOWNLOAD\种子\市来美保姬野尤里姬野优里姫野ゆうり.txt
// npm run find -- G:\TDDOWNLOAD\种子\松下紗栄子.txt
// npm run find -- G:\TDDOWNLOAD\种子\小西悠小西まりえKONISHI YU.txt
// npm run find -- G:\TDDOWNLOAD\种子\朝桐光南野灯南野あかりAKARI MINAMINO.txt
// npm run find -- G:\TDDOWNLOAD\种子\董美香すみれ美香SUMIRE MIKA.txt
// npm run find -- G:\TDDOWNLOAD\种子\京香julia.txt
// npm run find -- G:\TDDOWNLOAD\种子\上原保奈美うえはらほなみHonami Uehara.txt
// npm run find -- G:\TDDOWNLOAD\种子\桐原绘里香 桐原エリカErika Kirihara.txt

const outputDir = 'C:/Users/DELL/Desktop/新建文件夹 (3)';

// 正式开始
ask(url => {
	const outputPath = path.join(outputDir, getFileName(url));

	const has = hasDownload();
	const tempHas = dataToArray(has, 'name');

	// 读取 txt 文件，将每行链接转为对象
	const txt = fs.readFileSync(url, "utf-8");
	const links = txt.match(/magnet:?[^\n]+/g);
	const will = links.reduce((re, link) => {
		// 匹配 110313-691 MKBD-S60 RED-195 21ID-008 这几种番号
		let name = (link.match(/\d+[\-\_]\d+\w*/g) || link.match(/\d*\w+[\-\_]\w*\d+\w*/) || [])[0];
		if (!name) { console.log('问题链接'.red, link); return re; }
		name = convertName(name);
		re[name] = link;
		return re;
	}, {});

	// 看已下载中有没有，没有则将链接存入 result 等待导出
	let result = [];
	for (let name in will) {
		const item = tempHas.filter(n => n.includes(name))[0];
		const link = will[name];
		console.log(item ? '已下載'.green : '未下載'.red, name.padEnd(12, ' '), link);
		if (item) continue;
		result.push({ name, link });
	}

	if (result.length < 1) {
		fs.existsSync(outputPath) && fs.unlinkSync(outputPath);
		return console.log('全部已下载');
	}

	// 排个序，A 在前
	result = result.sort((a, b) => a.name < b.name ? -1 : 1);

	// 开始导出
	const newTxt = dataToArray(result, 'link').join('');
	fs.writeFileSync(outputPath, newTxt, 'utf8');
	console.log('已导出到桌面，还有 ' + result.length + '个未下载');
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