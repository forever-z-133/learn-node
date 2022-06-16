import axios from 'axios';
import * as cheerio from 'cheerio';
import { baseUrl } from '../config.mjs';

// 获取链接列表总页数
const getLinksListCount = async () => {
  const { data: html } = await axios.get(baseUrl);
  const $ = cheerio.load(html);
  const $pager = $('.pager-last > a');
  const href = $pager.attr('href');
  const count = Number(href.split('=')[1]);
  return count;
};
export default getLinksListCount;
