import axios from 'axios';
import * as cheerio from 'cheerio';
import forEachDom from '../other/forEachDom.mjs';
import addBaseUrl from '../other/addBaseUrl.mjs';
import getSafeFileName from '../convert/getSafeFileName.mjs';
import { throwError } from '../../../../utils/others.mjs';

// 获取文章链接列表
const getLinksList = async pageUrl => {
  try {
    console.log('请求中', pageUrl);
    const { data: html } = await axios.get(pageUrl);
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
  } catch(err) {
    throwError(err.message);
    return [];
  }
};
export default getLinksList;
