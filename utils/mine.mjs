import { isNumberString, addZero } from './index.mjs';

const d_d_reg = /\d{4,}[-_]\d{3,}\w*/; // 匹配 110313-691
const w_d_reg = /\d{0,2}\w+[-_]\w?\d{2,}[a-eA-E]?/; // 匹配 MKBD-S60 RED-195 21ID-008 RED-195A

/**
 * 获取路径中的番号
 * @param {String} link 文件路径
 * @returns string
 */
export const getCodeName = link => {
  if (!link || !link.trim().length) return '';
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
const codeNameDivideReg = /add|-|_/;
const codeNameNumberReg = /^(S)?(\d{2,7})(un)?([_-](\d))?([A-E])?.*/;
export const convertCodeName = name => {
  if (!name) return '';
  const [p, n, e] = name.split(codeNameDivideReg);
  if (!n) return p;
  const prev = p.toLocaleUpperCase();
  const temp = e && isNumberString(e) ? [n, e].join('_') : n;
  const next = temp.replace(codeNameNumberReg, (_, a, b, c, d, e, f) => {
    const prefix = a ? a.toLocaleUpperCase() : '';
    const num = addZero(b, 3 - prefix.length);
    const linePart = e ? String.fromCodePoint(+e + 64) : '';
    const charPart = f ? f.toLocaleUpperCase() : '';
    return `${prefix}${num}${linePart}${charPart}`;
  });
  return `${prev}-${next}`;
};


/**
 * 去掉番号的后缀
 * @param {String} name 标准番号
 * @returns string
 */
const codeNamePartReg = /[A-E]$/;
export const removeCodeNamePart = name => name.replace(codeNamePartReg, '');
