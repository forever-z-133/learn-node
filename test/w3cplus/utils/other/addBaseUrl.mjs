import path from 'path';
import { baseUrl } from '../../config.mjs';

const localHrefReg = /^.*?\//;

// 转化本地相对路径为线上路径，比如 ./index.html 转为 {baseUrl}/index.html
const addBaseUrl = href => {
  const isLocal = localHrefReg.test(href);
  if (!isLocal) return href;
  return path.join(baseUrl, href).replace(/\\/g, '/');
};
export default addBaseUrl;
