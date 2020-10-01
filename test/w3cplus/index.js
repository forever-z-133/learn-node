const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const inquirer = require('inquirer');
const { makeDirSync, addDataToUrl } = require('../../utils/index.js');

const baseImgUrl = 'https://www.w3cplus.com';
const expire = 1601569067;
const code = 'ZsBeD7tsgzg';
const sign = '63cc2f94f6ef5f67baabef8596a3ea99';
const htmlFileDir = path.resolve(__dirname, 'temp');

/**
 * 爬取 w3cplus 网站上的文章
 */
(async function () {
  makeDirSync(htmlFileDir);

  // 询问要处理的文件夹
  let [url] = process.argv.slice(2);
  if (!url) url = await askUrl();
  const fileName = url.split('/').slice(-1)[0].slice(0, -5);

  // 读取内容
  console.log('download...', url);
  const content = await ajaxContent(url);

  // 爬到了付费信息，需重新登录
  if (content.includes('id="paywall-link-box"')) {
    return console.log('授权失效，需重新授权');
  }

  // 写成文件
  const filePath = path.join(htmlFileDir, fileName + '.html');
  writeToHtml(content, filePath);
  console.log('完成', filePath);
})();

// 询问处理哪个链接
function askUrl(callback) {
  const question = [{ type: 'input', name: 'dir', message: '处理哪个链接' }];
  return inquirer.prompt(question).then(({ dir }) => {
    callback && callback(dir);
    return dir;
  });
}

// 获取链接中文章部分的 html 字符串
async function ajaxContent(url) {
  url = addDataToUrl(url, { expire, code, sign });
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);
  const $content = $('.field-name-body');
  convertImgsAttr($, $content);
  convertVideosAttr($, $content);
  return $content.html();
}

// 处理图片部分
function convertImgsAttr($, $content) {
  const $imgs = $content.find('img');
  for (let i in $imgs) {
    if (!$imgs.hasOwnProperty(i) || !/\d+/.test(i)) continue;
    const $img = $($imgs[i]);
    const src = $img.attr('src');
    const newSrc = addPrefix(src);
    if (src !== newSrc) $img.attr('src', newSrc);
  }
}

// 处理视频部分
function convertVideosAttr($, $content) {
  const $iframes = $content.find('iframe');
  for (let i in $iframes) {
    if (!$iframes.hasOwnProperty(i) || !/\d+/.test(i)) continue;
    const $iframe = $($iframes[i]);
    const src = $iframe.attr('src');
    if (!/\.(mp4|avi|rmvb)$/.test(src)) continue;
    $iframe.replaceWith(`<video src="${src}" controls width="100%" height="600"></video>`);
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
  if (/^\//.test(src)) src = `${baseImgUrl}${src}`;
  return src;
}
