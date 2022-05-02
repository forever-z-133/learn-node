// 需下载 youtube-dl 和 python 和 ffmpeg，并加入系统变量
// https://gitee.com/mirrors/youtube-downloader
// https://www.python.org/downloads/
// https://www.gyan.dev/ffmpeg/builds/
// 其中 9898 为 VPN 在本地映射的端口号
// zyh7294320@gmail.com

const inquirer = require("inquirer");
const spawn = require("cross-spawn");

const output = 'C:/Users/61775/Desktop/';
const outputFileName = `${output}%(title)s.%(ext)s`;

(async function() {
  // const url = 'https://www.youtube.com/watch?v=PLiDghW8oE0';
  const url = await askForUrl();
  console.log('开始下载...');
  const res = spawn.sync("cmd.exe", ["/c", `youtube-dl ${url} -u 617754841@qq.com -p zyh1992520 --proxy 127.0.0.1:9898 -f18 -o ${outputFileName}`]);
  if (res.stderr) return console.log(res.stderr.toString('utf8'));
  console.log('下载完成');
  spawn.sync("cmd.exe", ["/c", `start ${output}`]);
})();

// 询问要下载的 youtube 链接
async function askForUrl() {
  const question = [
    {
      type: "input",
      name: "url",
      message: `要下载的链接：`,
    },
  ];
  const result = await inquirer.prompt(question);
  const { url } = result || {};
  return url;
}