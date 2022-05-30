import path from 'path';
import fs from 'fs-extra';
import { divideArray } from '../../utils/index.mjs';
import getTempFile from './utils/getTempFile.mjs';
import getCssRules from './utils/getCssRules.mjs';
import getFontFamilyData from './utils/getFontFamilyData.mjs';
import getFontIconsData from './utils/getFontIconsData.mjs';
import createHTML from './utils/createHtml.mjs';

const run = async url => {
  // 读取 css 文件内容
  const cssUrl = await getTempFile(url);
  const cssContent = fs.readFileSync(cssUrl, 'utf8');

  // 将 css 文件内容转变为数组
  const cssRules = getCssRules(cssContent);

  // 根据数组抽离所需数据
  const [familyRules, restRules] = divideArray(cssRules, e => e.key.includes('@font-face'));
  const familyData = getFontFamilyData(cssUrl, familyRules);
  // const iconsData = getFontIconsData(restRules);

  // // 按照数据生成 html 字符串
  // const fontIconsMap = {
  //   fontFamily: familyData.fontFamily,
  //   icons: iconsData,
  // };
  // const html = createHTML(cssUrl, fontIconsMap);

  // // 生成 html 文件

  // // 用浏览器打开 html
}

export default run;
