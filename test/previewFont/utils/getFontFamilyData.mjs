import { camelizeKeys, getPureUrl, stringToObject } from '../../../utils/index.mjs';

const fontUrlReg = /url\(["'](.*?)["']\)/g;

// 把 @font-face 中的 src 转为数组
export const getFontUrls = src => {
  const result = [];
  src.replace(fontUrlReg, (_, u) => {
    const url = getPureUrl(u);
    result.push(url);
  });
  return result;
};

/**
 * 获取字体的数据
 * @param {Array} familyRules font-face 相关的样式键值对
 * @returns array
 */
const getFontFamilyData = familyRules => {
  const result = [];

  familyRules.forEach(({ value }) => {
    const attrs = camelizeKeys(stringToObject(value, ';', ':'));
    const { fontFamily } = attrs;
    result.push({ fontFamily });
  });

  return result;
};

export default getFontFamilyData;
