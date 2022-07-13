import axios from 'axios';
import * as cheerio from 'cheerio';
import { addDataToUrl } from '../../../../utils/index.mjs';
import authorization from '../../config.mjs';
import convertLinkContent from '../convert/convertLinkContent.mjs';
import { throwError } from '../../../../utils/others.mjs';

// 获取文章正文内容
const getLinkContent = async link => {
  const url = addDataToUrl(link, authorization) + '#paywall';
  try {
    console.log('请求中', url);
    const { data: html } = await axios.get(url, {
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en-US;q=0.7,en;q=0.6',
        // ':authority': 'www.w3cplus.com',
        // ':scheme': 'https'
      },
    });
    const $ = cheerio.load(html);
    let $content = $('.field-name-body');
    if ($content.length < 1) {
      // 如果找不到内容，就再向上层一点，比如 collective-7.html 中会出现其他内容的情况
      $content = $('.body-content');
    }
    convertLinkContent($, $content);
    const content = $content.html();
    return content;
  } catch(err) {
    throwError(err.message);
    return '';
  }
};
export default getLinkContent;
