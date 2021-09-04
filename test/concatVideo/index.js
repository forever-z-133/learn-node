const fs = require("fs");
const inquirer = require("inquirer");
const spawn = require("cross-spawn");

const output = 'C:/Users/61775/Desktop/';
const inputFileName = 'video.txt';
const outputFileName = `${output}output.mp4`;

(async function() {
  const url = await askForUrl();
  console.log('开始合并...');
  const input = url.split(/[,|]/g).map(e => `file ${output}${e}.mp4`).join('\n');
  fs.writeFileSync(inputFileName, input, 'utf8');
  const res = spawn.sync("cmd.exe", ["/c", `ffmpeg -f concat -safe 0 -i video.txt -c copy ${outputFileName}`]);
  if (res.stderr) console.log(res.stderr.toString('utf8'));
  fs.unlinkSync(inputFileName);
  console.log('合并完成');
  spawn.sync("cmd.exe", ["/c", `start ${output}`]);
})();

// 询问要合并的视频名称，多个用 , 或 | 分割
async function askForUrl() {
  const question = [
    {
      type: "input",
      name: "url",
      message: `视频名称：`,
    },
  ];
  const result = await inquirer.prompt(question);
  const { url } = result || {};
  return url;
}
