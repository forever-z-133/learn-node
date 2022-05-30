import { camelizeKeys, stringToObject } from '../../../utils/index.mjs';

/**
 * 获取图标数据
 * @param {Array} cssRules 样式键值对
 * @param {Array} familyData 字体相关数据
 * @returns array
 */
const getFontIconsData = (cssRules, familyData) => {
  const result = [];

  // 找到字体对应的类名，比如 .glyphicon
  const familyNamesReg = new RegExp(`font-family:.*?${familyData.map(e => e.fontFamily).join('|')}`);
  const hasFontFamilyRules = cssRules.filter(e => e.value.includes('font-family'));
  const iconPrevClassRules = hasFontFamilyRules.filter(e => familyNamesReg.test(e.value));
  const iconPrevClassNames = iconPrevClassRules.map(e => e.key.slice(1));
  const iconPrevClassAttrs = iconPrevClassRules.map(e => camelizeKeys(stringToObject(e.value, ';', ':')));

  // 在有 content 的类中，找到带字体类名的图标类，比如 .glyphicon-plus
  const hasContentRules = cssRules.filter(e => e.value.includes('content:'));
  hasContentRules.forEach(({ key }) => {
    const name = key.split(':')[0].slice(1);
    const matchIndex = iconPrevClassNames.findIndex(n => name.includes(n));
    if (matchIndex < 0) return;
    const family = iconPrevClassNames[matchIndex];
    const attrs = iconPrevClassAttrs[matchIndex];
    const { fontFamily } = attrs;
    result.push({ name, family, fontFamily });
  });

  return result;
}
export default getFontIconsData;
