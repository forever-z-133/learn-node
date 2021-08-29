const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { getFilesInDirSync, getFileUnit, makeDirSync, download, forEachAsync } = require('../../utils/index.js');
require('../../test/consoleColor');

// 爬虫 www.its99.com 网站下推女郎图片
// TODO： 图片下载报错问题 http://www.its99.com/luyilu/2020/1014/5933/
// TODO： 有概率网站请求受限

const webBaseUrl = 'http://www.its99.com';
const outputDir = path.resolve('F:\\tuigirl');

const excludes = [];

(async function () {
  makeDirSync(outputDir);

  await (async function loop(count = 1) {
    console.log('xxxxxxxxxxxxxxxxxxxxxxx ' + count);
    await downloadOneList(count);
    await loop(count + 1);
  })();
})();

// 下载一个列表
async function downloadOneList(page = 1) {
  const url = `${webBaseUrl}/page/${page}/?s=%E6%8E%A8%E5%A5%B3%E9%83%8E`;
  await loadUrlList(url, async (itemData, i) => {
    if (itemData === null) throw new Error('finish');
    // 处理列表的其中一条文章链接
    const { href: articleUrl, title } = itemData;
    if (excludes.includes(articleUrl)) return;
    const cache = getFilesInDirSync(outputDir);
    // if (isCachedArticle(title)) return console.log(`此链接已下载，则跳过 ${articleUrl}\n`);
    const articleTips = `开始处理文章 ${articleUrl} ${title}`.green;
    console.group(articleTips);
    let prevIndex = 0;
    await loadArticleUrl(articleUrl, async (partData, ii) => {
      // 处理文章的其中一批
      const { imgs } = partData;
      const partTips = `获取到第 ${ii + 1} 批图片，共 ${imgs.length} 张`;
      console.group(partTips);
      await downloadOnePartImages(partData, prevIndex);
      prevIndex += imgs.length;
      console.groupEnd(partTips);
      // if (ii === 0) return false;
    });
    console.groupEnd(articleTips);
    console.log(`------- finish -----------------------------\n`);
    // if (i === 0) return false;
  });
}

// 请求一页列表，获取能用的文章链接
async function loadUrlList(url, func) {
  const { data: html, request } = await axios.get(url);
  if (request._redirectable._isRedirect) return undefined;
  const $ = cheerio.load(html);
  const $urls = $('.excerpt-one').find('h2 > a');
  if ($urls.length < 1) {
    func(null);
  } else {
    for (let i = 0; i < $urls.length; i++) {
      const $item = $($urls[i]);
      const title = $item.text().replace(/[\\*"?<>/:]/g, '');
      const href = $item.attr('href');
      const res = await func({ title, href }, i);
      const isContinue = res === undefined ? true : res;
      if (!isContinue) return;
    }
  }
}

// 请求文章链接（即分批图片），
async function loadArticleUrl(articleUrl, func) {
  let isContinue = true;
  await (async function loop(count = 1) {
    if (!isContinue) return;
    const url = count === 1 ? articleUrl : `${articleUrl}${count}/`;
    const data = await getOnePartData(url);
    if (!data) return; // 请求到最后一页
    if (func) {
      const res = await func(data, count - 1);
      isContinue = res === undefined ? true : res;
    }
    await loop(++count);
  })();
}

// 请求某一批图片的信息
let lastImgs = [];
async function getOnePartData(url) {
  const { data: html, request } = await axios.get(url);
  // 若该页是跳转的，则说明是分批的最后一页了
  if (request._redirectable._isRedirect) return undefined;
  const $ = cheerio.load(html);
  // 获取标题
  const title = $('.article-title > a').text().replace(/[\\*"?<>/:]/g, '');
  // 提取每批的图片
  const $imgs = $('.article-content > p > img');
  const imgs = [];
  for (let i = 0; i < $imgs.length; i++) {
    const src = $($imgs[i]).attr('src');
    if (src) imgs.push(src);
  }
  if (lastImgs.join(',') === imgs.join(',')) return undefined;
  lastImgs = imgs;
  return { url, title, imgs };
}

// 下载一批图片
async function downloadOnePartImages(partData, prevIndex) {
  return new Promise(async resolve => {
    const { title, imgs } = partData;
    // 准备导出文件夹
    const dir = path.join(outputDir, title);
    makeDirSync(dir);
    const cache = getFilesInDirSync(dir);
    // 多线程下载图片
    forEachAsync(imgs, async (i, img, next) => {
      const fileName = (prevIndex + i) + getFileUnit(img, '.jpg');
      if (cache.includes(fileName)) {
        // 已下载则跳过
        const resultPath = path.join(dir, fileName);
        console.log(`已有图片 ${resultPath}`);
      } else {
        // 下载图片
        console.log(`下载图片 ${img} -> ${fileName.italic}`);
        try {
          await download(img, dir, fileName);
        } catch (err) {
          console.log(`下载失败 ${img} -> ${fileName.italic}`.red);
        }
      }
      next();
    }, { finish: resolve });
  });
}

function isCachedArticle(title) {
  const cache = getFilesInDirSync(outputDir);
  if (cache.includes(title)) return true;
  return false;
}
