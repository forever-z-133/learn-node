import axios from 'axios';
import * as cheerio from 'cheerio';
import { addDataToUrl } from '../../../utils/index.mjs';
import { authorization } from '../config.mjs';
import convertLinkContent from './convertLinkContent.mjs';

// 获取文章正文内容
const getLinkContent = async link => {
  const url = addDataToUrl(link, authorization);
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);
  let $content = $('.field-name-body');
  if ($content.length < 1) {
    // 如果找不到内容，就再向上层一点，比如 collective-7.html 中会出现其他内容的情况
    $content = $('.body-content');
  }
  convertLinkContent($, $content);
  const content = $content.html();
  return content;
};
export default getLinkContent;
