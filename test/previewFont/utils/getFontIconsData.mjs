import { camelizeKeys, stringToObject } from '../../../utils/index.mjs';

const contentReg = /content:\s*?(["'])\\.+?\1/;

// 样式值里面是否存在图标内容，比如 content:'\e632'
const hasIconContent = str => contentReg.test(str);

/**
 * 获取图标数据
 * @param {Array} cssRules 样式键值对
 * @param {Array} familyData 字体相关数据
 * @returns array
 */
const getFontIconsData = (cssRules, familyData, defaultKey) => {
  const result = [];

  // 找到字体对应的类名，比如 .glyphicon
  const familyNames = familyData.map(e => e.fontFamily);
  const familyNamesReg = new RegExp(`font(-family)?:.*?${familyNames.join('|')}`);
  const hasFontFamilyRules = cssRules.filter(e => e.value.includes('font:') || e.value.includes('font-family:'));
  const iconPrevClassRules = hasFontFamilyRules.filter(e => familyNamesReg.test(e.value));
  const iconPrevClassNames = iconPrevClassRules.map(e => e.key.slice(1));
  const iconPrevClassAttrs = iconPrevClassRules.map(e => camelizeKeys(stringToObject(e.value, ';', ':')));

  // 在有 content 的类中，找到带字体类名的图标类，比如 .glyphicon-plus
  const hasContentRules = cssRules.filter(e => hasIconContent(e.value));
  hasContentRules.forEach(({ key }) => {
    const name = key.split(':')[0].slice(1);
    const matchIndex = defaultKey ? 0 : iconPrevClassNames.findIndex(n => name.includes(n));
    if (matchIndex < 0) return;
    const family = iconPrevClassNames[matchIndex];
    const attrs = iconPrevClassAttrs[matchIndex];
    const fontFamily = familyData.find(e => attrs.font?.includes(e.fontFamily) || attrs.fontFamily?.includes(e.fontFamily)).fontFamily;
    result.push({ name, family, fontFamily });
  });

  return result;
};
export default getFontIconsData;
