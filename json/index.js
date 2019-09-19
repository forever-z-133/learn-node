const fs = require('fs');
const inquirer = require('inquirer');

(async () => {
  const type = await chooseType();
  const url = __dirname + '/temp.json';
  switch (type) {
    case 'write':
      var json = { a: 1 };
      writeJson(url, json);
      console.log('写入成功');
      break;
    case 'read':
      var json = readJson(url);
      console.log(json);
      break;
    default:
      throw new Error('没有这个案例');
  }
})();

function readJson(url) {
  if (!fs.existsSync(url)) throw new Error('文件不存在');
  if (!/\.json$/i.test(url)) throw new Error('链接不是 json 文件');
  let str = fs.readFileSync(url, 'utf8');
  try {
    return JSON.parse(str);
  } catch(e) { throw e; }
}

function writeJson(url, data) {
  if (!/\.json$/i.test(url)) throw new Error('链接不是 json 文件');
  try {
    var str = JSON.stringify(data);
    fs.writeFileSync(url, str);
  } catch(e) { throw e; }
}

async function chooseType() {
  const answer = await inquirer.prompt([{
    type: "list",
    name: "type",
    message: "选择测试模式",
    choices: [{
      name: '写入 JSON 文件',
      value: 'write'
    }, {
      name: '读取 JSON 文件',
      value: 'read'
    }]
  }]);
  return answer.type;
}

module.exports = {
  readJson, writeJson
}