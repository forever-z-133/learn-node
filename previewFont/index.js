const fs = require('fs');
const path = require('path');
const { getUrlContent } = require('../utils');

/**
 * 有字体文件，却不知他们长什么样，于是便有了此插件来解决痛点
 * 传入 css 文件，拿到 font 文件，生成 html 并预览
 */

previewFont(process.argv[2], __dirname);

async function previewFont(input, output) {
  const txt = await getUrlContent(input);
  console.log(txt);
}
