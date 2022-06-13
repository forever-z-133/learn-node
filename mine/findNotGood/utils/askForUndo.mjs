import inquirer from 'inquirer';
import '../../../test/consoleColor/index.js';

// 拼凑询问项
const getChoices = (needDelete, needCreate) => {
  const choices = [];
  needDelete.forEach(url => {
    choices.push({ value: `remove ${url}`, name: `${'删除'.red}：${url}` });
  });
  needCreate.forEach(url => {
    choices.push({ value: `create ${url}`, name: `${'新增'.green}：${url}` });
  });
  choices.push({ value: 'cancel', name: '退出' });
  return choices;
};

/**
 * 询问删除或新增哪个文件
 */
const askForUndo = async (name, needDelete, needCreate) => {
  const choices = getChoices(needDelete, needCreate);

  const result = await inquirer.prompt([
    {
      type: 'list',
      name: 'choose',
      choices,
      message: `（${name}）`
    }
  ]);
  const { choose } = result || {};

  const [method, url] = choose.split(' ');
  return { method, url };
};
export default askForUndo;
