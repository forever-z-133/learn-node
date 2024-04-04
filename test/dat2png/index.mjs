import fs from 'fs-extra';
import path from 'path';
import { execFileSync } from 'child_process';
import { forEachDir, getThisDir } from '../../utils/paths.mjs';

const thisPath = getThisDir();
const exePath = path.join(thisPath, 'dattoimg.exe');

const run = async dir => {
  // 遍历出需要转换的文件
  const outputPaths = [];
  forEachDir(dir, uri => {
    const { name, ext } = path.parse(uri);
    if (ext !== '.dat') return;

    // 拼凑结果路径
    const outputPath = path.format({ dir, name, ext: '.png' });

    // 如果已经存在，可能是另一张 png，也可能是已经转换过的
    if (fs.existsSync(outputPath)) {
      console.log('skip: ', uri);
      return;
    }

    outputPaths.push([uri, outputPath]);
  });

  // 进行转换
  for (const [input, output] of outputPaths) {
    // console.log('convert: ', input);
    execFileSync(exePath, [input], { killSignal: 'SIGTERM' });
    console.log('success: ', output);
  }
};
export default run;
