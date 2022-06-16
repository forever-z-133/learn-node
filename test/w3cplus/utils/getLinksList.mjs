import axios from 'axios';
import * as cheerio from 'cheerio';
import { addDataToUrl } from '../../../utils/index.mjs';
import forEachDom from './forEachDom.mjs';
import addBaseUrl from './addBaseUrl.mjs';
import getSafeFileName from './getSafeFileName.mjs';


// 获取文章链接列表
const getLinksList = async pageUrl => {
  const url = addDataToUrl(pageUrl, '');
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);
  const $urls = $('#block-system-main .node-blog');
  const result = [];
  forEachDom($, $urls, $item => {
    const href = $item.find('h1 > a').attr('href');
    const name = $item.find('h1 > a').text().trim();
    const time = $item.find('.submitted > span:nth-child(2)').text();
    const url = addBaseUrl(href);
    const title = getSafeFileName(name);
    result.push({ title, url, time });
  });
  return result;
};
export default getLinksList;
