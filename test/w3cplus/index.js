const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const inquirer = require('inquirer');
const { makeDirSync, addDataToUrl, forEachAsync } = require('../../utils/index.js');

const baseUrl = 'https://www.w3cplus.com';
const expire = 1640524156;
const code = 'FbsWzMoPxg4';
const sign = '79458f2dec5cdde336e04824eaf0cefa';
const htmlFileDir = path.resolve(__dirname, 'temp');

/**
 * 爬取 w3cplus 网站上的文章
 */
(async function () {
  makeDirSync(htmlFileDir);

  // 询问要处理的文件夹
  let [url] = process.argv.slice(2);
  if (!url) url = await askUrl();

  if (url === 'auto') {
    // 自动全爬取
    let page = 1;
    let ended = 10;
    (async function loop() {
      const listUrl = addDataToUrl(baseUrl, { page });
      console.log('-----------------------');
      console.log('自动爬取', listUrl);
      await doItMore(listUrl);
      if (page >= ended) return console.log('finish');
      page++;
      loop();
    })();
  } else if (url.includes('page=')) {
    // 链接内容是列表，则批处理
    const listUrl = url;
    await doItMore(listUrl);
  } else {
    // 链接内容是文章，则直接处理
    await doIt(url);
  }
})();

// 询问处理哪个链接
function askUrl(callback) {
  const question = [{ type: 'input', name: 'dir', message: '处理哪个链接' }];
  return inquirer.prompt(question).then(({ dir }) => {
    callback && callback(dir);
    return dir;
  });
}

// 处理多个文章，即列表链接
async function doItMore(listUrl, callback) {
  const urls = await findArticleUrls(listUrl);
  return new Promise((resolve) => {
    forEachAsync(
      urls,
      async (i, _url, next) => {
        try {
          await doIt(_url);
          next();
        } catch(err) {
          next();
        }
      },
      {
        number: 1,
        finish: () => {
          console.log('本页数据已全部下载完成');
          resolve();
        },
      }
    );
  });
}

// 处理单个文章
async function doIt(url) {
  const fileName = url.split('/').slice(-1)[0].slice(0, -5);

  // 读取内容
  // console.log('download...', url);
  const content = await ajaxContent(url);

  // 爬到了付费信息，需重新登录
  if (content.includes('id="paywall-link-box"')) {
    return console.log('授权失效，需重新授权');
  }

  // 写成文件
  const filePath = path.join(htmlFileDir, fileName + '.html');
  writeToHtml(content, filePath);
  console.log('完成', filePath);
}

// 从列表链接中读取文章链接列表
async function findArticleUrls(listUrl, callback) {
  const { data: html } = await axios.get(listUrl);
  const $ = cheerio.load(html);
  const $urls = $('.node > h1 > a');
  const result = [];
  forEachDom($, $urls, ($url) => {
    const href = $url.attr('href');
    const url = `${baseUrl}${href}`;
    result.push(url);
    callback && callback(url);
  });
  return result;
}

// 获取链接中文章部分的 html 字符串
async function ajaxContent(url) {
  url = addDataToUrl(url, { expire, code, sign });
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);
  let $content = $('.field-name-body');
  if ($content.length < 1) {
    // 如果找不到内容，就再向上层一点，比如 collective-7.html 中会出现其他内容的情况
    $content = $('.body-content');
  }
  convertLinkHref($, $content);
  convertImgsAttr($, $content);
  convertVideosAttr($, $content);
  return $content.html();
}

// 处理链接部分
function convertLinkHref($, $content) {
  const $links = $content.find('a');
  forEachDom($, $links, ($link) => {
    let href = $link.attr('href') || '';
    href = addPrefix(href);
    href = href.replace(/\/\/www.w3cplus.com\/[^/]+\//, './');
    $link.attr('href', href);
  });
}

// 处理图片部分
function convertImgsAttr($, $content) {
  const $imgs = $content.find('img');
  forEachDom($, $imgs, ($img) => {
    const src = $img.attr('src') || '';
    const newSrc = addPrefix(src);
    if (src !== newSrc) $img.attr('src', newSrc);
  });
}

// 处理视频部分
function convertVideosAttr($, $content) {
  const $iframes = $content.find('video');
  forEachDom($, $iframes, ($iframe) => {
    let src = $iframe.attr('src') || '';
    const newSrc = addPrefix(src);
    if (src !== newSrc) src = newSrc;
    if (!/\.(mp4|avi|rmvb)$/.test(src)) return;
    $iframe.replaceWith(`<video src="${src}" controls width="100%" height="600"></video>`);
  });
}

// 遍历 cheerio 的列表 dom
function forEachDom($, $list, callback) {
  for (let i in $list) {
    if (!$list.hasOwnProperty(i) || !/\d+/.test(i)) continue;
    const $item = $($list[i]);
    callback && callback($item);
  }
}

// 写进模板 html 文件中
function writeToHtml(content, filePath) {
  const template = getTemplateHtml();
  const html = template.replace('{{ content }}', content);
  fs.writeFileSync(filePath, html, 'utf8');
}

// 读取模板 html 并缓存
let cacheTemplateHtml = '';
function getTemplateHtml() {
  if (cacheTemplateHtml) return cacheTemplateHtml;
  const templatePath = path.join(htmlFileDir, '../template.html');
  const template = fs.readFileSync(templatePath, 'utf8');
  cacheTemplateHtml = template;
  return template;
}

// 给图片加上前缀
function addPrefix(src) {
  if (/^\/(?!\/)/.test(src)) src = `${baseUrl}${src}`;
  return src;
}
