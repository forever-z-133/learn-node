const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const { readFile, forEachDeep, stringToObject } = require('../utils');

/**
 * 有字体文件，却不知他们长什么样，于是便有了此插件来解决痛点
 * 传入 css 文件，拿到 font 文件，生成 html 并预览
 */

// npm run font -- ./previewFont/bootstrap/bootstrap.css
// npm run font -- https://cdn.bootcss.com/twitter-bootstrap/3.4.1/css/bootstrap.css

const input = process.argv[2];
previewIconFont(input).then(res => {
  console.log(res);
});

async function previewIconFont(input) {
  const cssStr = await readFile(input);
  if (!cssStr) return console.error('未获取到内容');
  const cssObj = cssStrToCssObject(cssStr);

  const fonts = []; // 带有字体名称的集合
  const conts = []; // 带有 font-family 的集合
  const icons = []; // 带有 :before{ content: '\000f' } 的集合
  forEachDeep(cssObj, 'child', item => {
    if (item.key.indexOf('@font-face') > -1) {
      fonts.push(item);
    } else if (item.attrs && (item.attrs.font || item.attrs['font-family'])) {
      conts.push(item);
    }
    if (item.key.includes(':before') || item.key.includes(':after')) {
      const { content } = item.attrs || {};
      if (/\\[0-9a-f]{4}/i.test(content)) {
        icons.push(item);
      }
    }
  });

  const iconfont = []; // 含有字体名称的类名，比如 .glyphicon
  conts.forEach(item => {
    const fontFamily = item.attrs && (item.attrs.font || item.attrs['font-family']);
    var inner = fonts.some(font => {
      const fontFamily2 = font.attrs && font.attrs['font-family'];
      return fontFamily.includes(fontFamily2);
    });
    if (inner) {
      iconfont.push(item);
    }
  });

  const result = iconfont.reduce((re, item) => {
    const fontFamily = (item.key.match(/(?<=\.|'|").+?(?='|"|$)/) || [])[0];
    re[fontFamily] = icons.reduce((res, icon) => {
      return icon.key.includes(fontFamily) ? res.concat([icon]) : res;
    }, []);
    return re;
  }, {}); // 获得 { 'Glyphicons Halflings': [] } 的结果

  const newHtml = renderHtml(result, input);
  return newHtml;
}

// 渲染 html 模板并生成新 html
function renderHtml(result, input) {
  let html = `
    <link rel="stylesheet" href="{{cssPath}}">
    <div>{{iconsTemplate}}</div>
  `;
  html = html.replace('{{cssPath}}', input);
  html = html.replace('{{iconsTemplate}}', function() {
    let _html = '';
    for (let fontFamily in result) {
      const list = result[fontFamily];
      _html += `<h1>${fontFamily}</h1>`;
      _html += list.reduce((re, item) => {
        const className = (item.key.match(/(?<=\.).+?(?=\:)/) || [])[0];
        if (!className) return re;
        const content = `<span class="${fontFamily} ${className}"></span> <i>${className}</i>`;
        return re + `<div style="float:left;margin-right:20px;">${content}</div>`;
      }, '');
    }
    return _html;
  });
  return html;
}

// css 字符串转 json 格式
function cssStrToCssObject(cssStr) {
  cssStr = cssStr.replace(/\s*[\t\n]\s*/g, ''); // 去掉换行
  cssStr = cssStr.replace(/\/\*.*?\*\//g, ''); // 去除注释

  const reg = /(?<=^|}|{)\s*([^}{]*?)\s*{(([^}]*?{.*?})|([a-z\-]*?:.*?(?=;|}))*)}/g;
  const cssObj = (function loop(str, res) {
    str.replace(reg, (match, key, attrs, child) => {
      if (child) {
        // @media{.b{x:1}} 形态的
        child = loop(child, []);
        attrs = void 0;
      } else if (attrs) {
        // .a{x:1} 形态的
        attrs = stringToObject(attrs, /\s*;\s*/, /\s*:\s*/);
      }
      res.push({ key, attrs, child });
    });
    return res;
  })(cssStr, []);

  return cssObj;
}
