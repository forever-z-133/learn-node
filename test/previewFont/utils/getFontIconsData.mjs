import { camelizeKeys, stringToObject } from '../../../utils/index.mjs';

// 样式值里面是否存在图标内容，比如 content:'\e632'
const contentReg = /content:\s*?(["'])\\.+?\1/;
export const hasIconContent = str => contentReg.test(str);

// 样式值是否包含字体名，比如 font-family:"iconfont" 或 font:14px/1 "iconfont"
export const hasFamilyName = familyName => {
  const reg = new RegExp(`font(-family)?:.*?(["']?)${familyName}\\2`);
  return str => reg.test(str);
};

/**
 * 获取图标数据
 * @param {Array} cssRules 样式键值对
 * @param {Array} familyData 字体相关数据
 * @returns array
 */
const getFontIconsData = (cssRules, familyData, defaultKey) => {
  const result = [];

  // 筛选数据，减少处理量
  const familyNames = familyData.map(e => e.fontFamily.replace(/"|'/g, ''));
  const checkIconContent = hasIconContent;
  const checkFamilyName = hasFamilyName(`(${familyNames.join('|')})`);
  const hasFontFamilyRules = [];
  const hasContentRules = [];
  cssRules.forEach(rule => {
    if (checkIconContent(rule.value)) hasContentRules.push(rule);
    else if (checkFamilyName(rule.value)) hasFontFamilyRules.push(rule);
  });

  // 找到图标对应的字体类名，比如 .glyphicon
  const iconPrevClassNames = hasFontFamilyRules.map(e => e.key.slice(1));

  // 找到图标对应的字体名称，比如 "iconfont"
  const iconPrevClassFontFamilys = hasFontFamilyRules.map(e => {
    const attrs = camelizeKeys(stringToObject(e.value, ';', ':'));
    const myFontFamily = attrs.fontFamily || attrs.font || '';
    const fontFamily = familyData.find(e => myFontFamily.includes(e.fontFamily)).fontFamily;
    return fontFamily;
  });

  // 在有 content 的类中，找到带字体类名的图标类，比如 .glyphicon-plus
  // name 为图标类名，family 为字体类名，fontFamily 为字体名称
  hasContentRules.forEach(({ key }) => {
    const name = key.split(':')[0].slice(1);
    const matchIndex = defaultKey ? 0 : iconPrevClassNames.findIndex(n => name.includes(n));
    if (matchIndex < 0) return;
    const family = iconPrevClassNames[matchIndex];
    const fontFamily = iconPrevClassFontFamilys[matchIndex];
    result.push({ name, family, fontFamily });
  });

  return result;
};
export default getFontIconsData;
