import { addZero } from './index.mjs';

const d_d_reg = /\d{4,}[-_]\d{3,}\w*/; // 匹配 110313-691
const w_d_reg = /\d{0,2}\w+[-_]\w?\d{2,}[a-eA-E]?/; // 匹配 MKBD-S60 RED-195 21ID-008 RED-195A

/**
 * 获取路径中的番号
 * @param {String} link 文件路径
 * @returns string
 */
export const getCodeName = link => {
  const match = link.match(d_d_reg) || link.match(w_d_reg);
  if (!match || !match.length) return '';
  return match[0];
};

/**
 * 转化为标准番号
 * @param {String} name 番号
 * @returns string
 *
 * Example: snisadd432un 转为 SNIS-432
 */
export const convertCodeName = name => {
  if (!name) return '';
  const [p, n] = name.split(/add|-|_/);
  const prev = p.toLocaleUpperCase();
  const next = addZero(n.replace(/un$/, '').toLocaleUpperCase(), 3);
  return `${prev}-${next}`;
};
