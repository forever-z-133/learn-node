const fs = require('fs');

/**
 * 从 txt 中找到我还没有的影片链接
 */
let textFilePath = '';
let outputPath = '';
// 已下载目录
const videoFilePath = 'I:/有码';
// const videoFilePath = 'I:/无码';
// 含有番号链接的文件
// textFilePath = 'I:/种子/仁科百华仁科百華momoka nishina.txt';
// textFilePath = 'I:/种子/冲田杏梨沖田杏梨観月あかねAnnri Okita.txt';
// textFilePath = 'I:/种子/京香julia.txt';
// textFilePath = 'I:/种子/水无濑优夏みなせ优夏上原実花Minase Yuuka.txt';
// textFilePath = 'I:/种子/愛実れい爱实丽.txt';
// textFilePath = 'I:/种子/くるみ未来Mirai.txt';
// textFilePath = 'I:/种子/爱田奈奈愛田奈々Nana Aida三津奈津美三津なつみNatsumi Mitsu.txt';
// textFilePath = 'I:/种子/本田莉子ほんだりこ仲里纱羽.txt';
// textFilePath = 'I:/种子/吉永茜.txt';
// textFilePath = 'I:/种子/藍沢潤(蓝泽润Jun Aizawa).txt';
// textFilePath = 'I:/种子/葵司葵つかさTSUKASA AOI.txt';
// textFilePath = 'I:/种子/原千草京野ゆめ尾崎あかり.txt';
// textFilePath = 'I:/种子/泷川索菲亚滝川ソフィアTAKIGAWA SOFIA.txt';
// textFilePath = 'I:/种子/葵葵S1Aoi.txt';
// textFilePath = 'I:/种子/sky high.txt';
// textFilePath = 'I:/种子/中村知恵なかむらともえ.txt';
// textFilePath = 'I:/种子/竹内爱Ai Takeuchi.txt';
// textFilePath = 'I:/种子/羽生稀.txt';
// textFilePath = 'I:/种子/滨崎里绪浜崎りお森下えりか篠原絵梨香.txt';
textFilePath = 'I:/种子/仁科百华仁科百華momoka nishina.txt';
// 结果导出目录
// outputPath = 'C:/Users/DELL/Desktop/仁科百华.txt';
// outputPath = 'C:/Users/DELL/Desktop/冲田杏梨.txt';
// outputPath = 'C:/Users/DELL/Desktop/JULIA.txt';
// outputPath = 'C:/Users/DELL/Desktop/水无濑优夏.txt';
// outputPath = 'C:/Users/DELL/Desktop/爱实丽.txt';
// outputPath = 'C:/Users/DELL/Desktop/雏形未来.txt';
// outputPath = 'C:/Users/DELL/Desktop/爱田奈奈.txt';
// outputPath = 'C:/Users/DELL/Desktop/本田莉子.txt';
// outputPath = 'C:/Users/DELL/Desktop/吉永茜.txt';
// outputPath = 'C:/Users/DELL/Desktop/蓝泽润.txt';
// outputPath = 'C:/Users/DELL/Desktop/葵司.txt';
// outputPath = 'C:/Users/DELL/Desktop/原千草.txt';
// outputPath = 'C:/Users/DELL/Desktop/泷川索菲亚.txt';
// outputPath = 'C:/Users/DELL/Desktop/sky.txt';
// outputPath = 'C:/Users/DELL/Desktop/中村知恵.txt';
// outputPath = 'C:/Users/DELL/Desktop/竹内爱.txt';
// outputPath = 'C:/Users/DELL/Desktop/羽生稀.txt';
// outputPath = 'C:/Users/DELL/Desktop/滨崎里绪.txt';
outputPath = 'C:/Users/DELL/Desktop/仁科百华.txt';

/***********************************************
 *
 * 找出下载目录中没有的番号链接
 * 
 *************************************************/

// 处理特殊结尾
var reg = /[abcd]$|(_|-)[01234abcd]$/i;

// 获取番号链接列表
var will = fs.readFileSync(textFilePath, "utf-8");

// 获取番号名称，key 为名称，value 为链接
will = will.match(/(^(?:magnet).+$)/gm, '');
var names = will.reduce((re, url) => {
	console.log(url);
	var name = url.match(/\w+[-_]\d+/g)[0];
	re[name] = url;
	return re;
}, {});

// 获取我已有资源名称
var has = fs.readdirSync(videoFilePath, 'utf8');
has = has.reduce((re, x) => {
	var name = x.split('.')[0]
	name = name.replace(reg, '');
	return re.concat([name]);
}, []);

// 从番号中找出我没有的番号
has = has.map(x => x.toLowerCase());
console.log(names);
var result = Object.keys(names).filter((name) => {
	name = name.replace('-', 'add').toLowerCase();
	name = name.replace(reg, '');
	return !~has.indexOf(name);
});

// 对这些番号进行 A-Z 排序
result = result.sort((a, b) => a.toUpperCase() < b.toUpperCase() ? -1 : 1);

// 获得原番号链接
result = result.reduce((re, x) => {
	return re.concat([names[x]]);
}, []);

// 生成结果打印
result = result.reduce((re, x) => {
	return re + x + '\r\n';
}, '');

console.log(result);
fs.writeFileSync(outputPath, result, 'utf8');