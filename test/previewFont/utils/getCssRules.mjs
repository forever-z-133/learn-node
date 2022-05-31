

// 去掉 css 文件内容中一些有干扰的字符串
const getPureCssContent = cssContent => {
  let result = cssContent;
  result = result.replace(/\s*[\t\n]\s*/g, ''); // 去掉换行
  result = result.replace(/\/\*.*?\*\//g, ''); // 去除注释
  return result;
};

/**
 * 将 css 文件内容转变为数组
 * @param {String} cssContent 样式文件内容
 * @returns array
 */
function getCssRules(cssContent) {
  if (!cssContent) return [];

  const str = getPureCssContent(cssContent);
  const cssRuleReg = /(?<=^|}|{)\s*([^}{]*?)\s*{(([^}]*?{.*?})|([a-z-]*?:.*?(?=;|}))*)}/g; // exec 需要重置所以放在函数内部
  const result = [];

  let temp = [];
  while ((temp = cssRuleReg.exec(str)) !== null) {
    const [, keys, values, child] = temp;

    const isWrapClass = child && child.trim().length; // 类似 @media{.b{x:1}} 嵌套结构的
    const value = isWrapClass ? '' : values;
    const children = isWrapClass ? getCssRules(child) : [];

    keys.split(',').forEach(k => {
      const key = k.trim();
      const rule = { key, value, children };
      result.push(rule);
    });
  }

  return result;
}
export default getCssRules;
