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
  // console.log(cssObj);
}

function cssStrToCssObject(cssStr) {
	cssStr = cssStr.replace(/\s*[\t\n]\s*/g, ''); // 去掉换行
  cssStr = cssStr.replace(/\/\*.*?\*\//g, ''); // 去除注释
  
  console.log(cssStr.match(/(?<=^|})[^}]*?{[^}]*?{.*?}}/)); // 匹配 .x{x{a:1}}

  // var keyReg = '[@\[\.#][^{]*(?={)';
  // var attrReg = '(?<=^|[{;])([a-z\-\s*]+):([^;$}]+);?';
  // var attrsReg = `(${attrReg})+`;
  // var reg = new RegExp(`(${keyReg}){((${attrsReg}|(${keyReg}{${attrsReg}})+))}`, 'gi');
  // reg = /([@[.#][^{]*(?={)){((((?<=^|[{;])([a-z-s*]+):([^;$}]+);?)+|([@[.#][^{]*(?={){((?<=^|[{;])([a-z-s*]+):([^;$}]+);?)+})+))}/gi;

  // return (function deep(inner) {
  //   var result = [];
  //   inner.replace(reg, (outerHTML, tagName, innerHTML) => {
  //     var temp = { tagName, outerHTML, innerHTML };
  //     if (innerHTML.indexOf('{') < 0) {
  //       temp.attrs = stringToObject(innerHTML, ';', ':');
  //     } else if (innerHTML) {
  //       temp.children = deep(innerHTML);
  //     }
  //     result.push(temp);
  //   });
  //   return result;
  // })(cssStr);
}

function forEachDeep(obj, childKey, callback) {
  for (let key in obj) {
    const item = obj[key];
    if (key === childKey && item) {
      if (Array.isArray(item) || typeOf(child) === 'object') {
        forEachDeep(item, childKey, callback);
      }
    } else {
      callback && callback(obj ,key, item);
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