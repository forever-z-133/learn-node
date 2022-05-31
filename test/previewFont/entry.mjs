import inquirer from 'inquirer';
import run from './index.mjs';

const testCssUrl = 'D:/zbooks/learn-node/test/previewFont/bootstrap/bootstrap.css';
const inputCssUrl = process.argv[2];

const entry = async () => {
  const urlByAsk = !inputCssUrl && await ask();
  run(urlByAsk || inputCssUrl || testCssUrl);
};

// 询问要合并的视频名称，多个用 , 或 | 分割
async function ask() {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: '要预览的 CSS 文件：',
    },
  ]);
  const { url } = result || {};
  return url;
}

entry();
