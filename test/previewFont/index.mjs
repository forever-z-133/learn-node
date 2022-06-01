import path from 'path';
import fs from 'fs-extra';
import spawn from 'cross-spawn';
import { getThisDir } from '../../utils/paths.mjs';
import { divideArray } from '../../utils/index.mjs';
import getTempFile, { isNetFile } from './utils/getTempFile.mjs';
import getCssRules from './utils/getCssRules.mjs';
import getFontFamilyData from './utils/getFontFamilyData.mjs';
import getFontIconsData from './utils/getFontIconsData.mjs';
import createHTML from './utils/createHtml.mjs';

const thisPath = getThisDir();
const outputDir = path.join(thisPath, 'temp');
const outputPath = path.join(outputDir, 'index.html');

fs.emptyDirSync(outputDir);

const run = async (url, defaultKey = '') => {

  // 读取 css 文件内容
  const cssUrl = await getTempFile(url);
  const cssContent = fs.readFileSync(cssUrl, 'utf8');

  // 将 css 文件内容转变为数组
  const cssRules = getCssRules(cssContent);

  // 根据数组抽离所需数据
  const [familyRules, restRules] = divideArray(cssRules, e => e.key.includes('@font-face'));
  const familyData = getFontFamilyData(familyRules);
  const iconsData = getFontIconsData(restRules, familyData, defaultKey);
  const fontIconsMap = familyData.reduce((res, { fontFamily }) => {
    const icons = iconsData.filter(e => e.fontFamily === fontFamily);
    res[fontFamily] = icons;
    return res;
  }, {});

  // 按照数据生成 html 字符串
  const relativeCssUrl = isNetFile(url) ? url : path.relative(outputDir, cssUrl);
  const html = createHTML(relativeCssUrl, fontIconsMap);

  // 生成 html 文件
  fs.ensureFileSync(outputPath);
  fs.writeFileSync(outputPath, html, 'utf8');

  // 用浏览器打开 html
  spawn.sync('cmd.exe', ['/c', `start ${outputPath}`]);
};

export default run;
