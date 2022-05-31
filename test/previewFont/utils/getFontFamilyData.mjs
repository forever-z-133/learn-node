import { camelizeKeys, stringToObject } from '../../../utils/index.mjs';

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
