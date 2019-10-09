const fs = require('fs');
const path = require('path');
const { getUrlContent, typeOf } = require('../utils');

/**
 * 有字体文件，却不知他们长什么样，于是便有了此插件来解决痛点
 * 传入 css 文件，拿到 font 文件，生成 html 并预览
 */

// npm run font -- ./previewFont/bootstrap/bootstrap.css
// npm run font -- https://cdn.bootcss.com/twitter-bootstrap/3.4.1/css/bootstrap.css

previewFont(process.argv[2]);

async function previewFont(input, output) {
  if (!/\.css/i.test(input)) throw new Error('请输入 .css 格式的文件路径');
  output = path.join(output || __dirname, 'temp');
  const cssStr = await getUrlContent(input, process.cwd());
  const cssObj = cssStrToCssObject(cssStr);
  
  const fonts = [];  // 带有字体名称的集合
  const conts = [];  // 带有 font-family 的集合
  const icons = [];  // 带有 :before{ content: '\000f' } 的集合
  forEachDeep(cssObj, 'child', (item) => {
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

  const iconfont = [];  // 含有字体名称的类名，比如 .glyphicon
  conts.forEach(item => {
    const fontFamily = item.attrs && (item.attrs.font || item.attrs['font-family']);
    var inner = fonts.some(font => {
      const fontFamily2 = font.attrs && font.attrs['font-family'];
      return fontFamily.includes(fontFamily2);
    })
    if (inner) {
      iconfont.push(item);
    }
  });

  const result = iconfont.reduce((re, item) => {
    const fontFamily = item.attrs && (item.attrs.font || item.attrs['font-family']);
    re[fontFamily] = icons.reduce((res, icon) => {
      return icon.key.includes(item.key) ? res.concat([icon]) : res;
    }, []);
    return re;
  }, {});  // 获得 { 'Glyphicons Halflings': [] } 的结果

  console.log(result);
}

function cssStrToCssObject(cssStr) {
	cssStr = cssStr.replace(/\s*[\t\n]\s*/g, ''); // 去掉换行
  cssStr = cssStr.replace(/\/\*.*?\*\//g, ''); // 去除注释
  
  const reg = /(?<=^|}|{)\s*([^}{]*?)\s*{(([^}]*?{.*?})|([a-z\-]*?:.*?(?=;|}))*)}/g;
  const cssObj = (function loop(str, res) {
    str.replace(reg, (match, key, attrs, child) => {
      if (child) { // @media{.b{x:1}} 形态的
        child = loop(child, []);
        attrs = void 0;
      } else if (attrs) { // .a{x:1} 形态的
        attrs = stringToObject(attrs, /\s*;\s*/, /\s*:\s*/);
      }
      res.push({ key, attrs, child });
    });
    return res;
  })(cssStr, []);

  return cssObj;
}

function forEachDeep(obj, childKey, callback) {
  for (let key in obj) {
    const item = obj[key];
    if (key === childKey && item) {
      if (Array.isArray(item) || typeOf(child) === 'object') {
        forEachDeep(item, childKey, callback);
      }
    } else {
      callback && callback(item, key, obj);
    }
  }
}

// a=1&b=2 转为 {a:1,b:2}
function stringToObject(str, divide, concat) {
  if (!str || typeof str !== 'string') return {};
  divide = divide || '&';
  concat = concat || '=';
  var arr = str.split(divide);
  return arr.reduce(function (re, item) {
    if (!item) return re;
    var temp = item.split(concat);
    var key = temp.shift().trim();
    var value = temp.join(concat).trim();
    if (!key) return re;
    if (['null', 'undefined'].indexOf(value) > -1) value = undefined;
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    re[key] = value;
    return re;
  }, {});
}