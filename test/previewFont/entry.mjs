import inquirer from 'inquirer';
import run from './index.mjs';

/**
 * 其他测试数据
 * yarn command font https://at.alicdn.com/t/font_2693685_3pfbcqdhz1d.css tx-icon
 * yarn command font https://cdn.bootcss.com/twitter-bootstrap/3.4.1/css/bootstrap.min.css
 * yarn command font https://fontawesome.com/css/app-e23924a0edb4b571d42fe2a3ca61ab8b.css fa4
 */

const testCssUrl = 'D:/zbooks/learn-node/test/previewFont/bootstrap/bootstrap.css';
const inputCssUrl = process.argv[2];
const inputKey = process.argv[3];

const entry = async () => {
  const { url: urlByAsk, defaultKey: defaultKeyByAsk } = !inputCssUrl && await ask();
  const url = urlByAsk || inputCssUrl || testCssUrl;
  const defaultKey = defaultKeyByAsk || inputKey;
  run(url, defaultKey);
};

// 询问要合并的视频名称，多个用 , 或 | 分割
async function ask() {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: '要预览的 CSS 文件：',
    },
    {
      type: 'input',
      name: 'defaultKey',
      message: '默认图标类(如: .tx-icon .fa4)：',
    },
  ]);
  const { url, defaultKey } = result || {};
  return { url, defaultKey };
}

entry();
