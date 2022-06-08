import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { addDataToUrl } from '../../../utils/index.mjs';
import { baseUrl } from '../config.mjs';
import forEachDom from './forEachDom.mjs';

// 获取文章链接列表
const getLinksList = async pageUrl => {
  const url = addDataToUrl(pageUrl, '');
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);
  const $urls = $('#block-system-main .node-blog > h1 > a');
  const result = [];
  forEachDom($, $urls, $item => {
    const href = $item.attr('href');
    const url = path.join(baseUrl, href);
    result.push(url);
  });
  return result;
};
export default getLinksList;
