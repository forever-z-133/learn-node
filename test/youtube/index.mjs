import inquirer from 'inquirer';
import spawn from 'cross-spawn';
import { desktopPath } from '../../utils/paths.mjs';

/**
 * 需下载 youtube-dl 和 python 和 ffmpeg，并加入系统变量
 * https://gitee.com/mirrors/youtube-downloader
 * https://www.python.org/downloads/
 * https://www.gyan.dev/ffmpeg/builds/
 * 其中 9898 为 VPN 在本地映射的端口号
 */

const outputFileName = `${desktopPath}%(title)s.%(ext)s`;

(async function () {
  // const url = 'https://www.youtube.com/watch?v=PLiDghW8oE0';
  const url = await askForUrl();

  console.log('开始下载...');

  const account = '-u 617754841@qq.com -p zyh1992520';
  const proxy = '--proxy 127.0.0.1:9898';
  const res = spawn.sync('cmd.exe', ['/c', `youtube-dl ${url} ${account} ${proxy} -f18 -o ${outputFileName}`], { stdio: 'inherit' });
  if (res.stderr) return;

  spawn.sync('cmd.exe', ['/c', `start ${desktopPath}`]);
})();

// 询问要下载的 youtube 链接
async function askForUrl() {
  const question = [
    {
      type: 'input',
      name: 'url',
      message: '要下载的链接：',
    },
  ];
  const result = await inquirer.prompt(question);
  const { url } = result || {};
  return url;
}
