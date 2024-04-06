import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';
import { forEachDir, getThisDir } from '../../utils/paths.mjs';
import createHTMLFile from './utils/createHTML.mjs';

const thisPath = getThisDir();

const tempDir = path.join(thisPath, 'temp');
fs.ensureDirSync(tempDir);

const outputPath = path.join(tempDir, 'index.html');

const enableExt = ['.png', '.jpg', '.jpeg', '.bmp', '.gif'];

const run = async dir => {
  // 遍历出可以预览的图片
  const tree = [];
  forEachDir(dir, (file, xpath, base) => {
    const { ext } = path.parse(file);
    if (!enableExt.includes(ext)) return;
    const folder = xpath.reduce((re, fold) => {
      let target = re.find(e => e.name === fold);
      if (!target) {
        target = { name: fold, children: [] };
        re.push(target);
      }
      return target.children;
    }, tree);
    folder.push({ name: base, src: file });
  });

  // 生成 html 文件
  const data = { tree };
  createHTMLFile(data, outputPath);

  // 打开浏览器
  spawn.sync('cmd.exe', ['/c', `start ${outputPath}`]);
};
export default run;
