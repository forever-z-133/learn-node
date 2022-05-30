
// 生成页面 html
const createPageHtml = (styleHtml, bodyHtml) => {
  return `
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
<meta charset="utf-8" />
<meta name="renderer" content="webkit">
<meta http-equiv="Content-Type" content="text/html" />
<meta http-equiv="Cache-Control" content="no-siteapp" />
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="format-detection" content="telephone=no" />
<meta name="wap-font-scale" content="no">
<title>iframe</title>
<!--[if lt IE 9]><script>alert('您的浏览器版本过低，请更新本版本浏览器，或更换为诸如谷歌浏览器的现代浏览器')</script><![endif]-->
${styleHtml}
</head>
<body>
${bodyHtml}
</body>
</html>
  `;
}

// 生成 style html
const createStyleHtml = fontUrl => {
  return `
  <link rel="stylesheet" href="${fontUrl}" />
  <style>
  .font-icon-list { overflow: hidden; }
  .font-icon-list-item { float:left;margin-right:20px; }
  </style>
  `;
}

// 生成 body html
const createBodyHtml = fontIconsMap => {
  let result = '';
  Object.keys(fontIconsMap).map(fontFamily => {
    const icons = fontIconsMap[fontFamily];
    result += `
      <h1>${fontFamily}</h1>
      <div class="font-icon-list">
        ${icons.map(icon => `
        <div class="font-icon-list-item">
          <i class="${icon.family} ${icon.name}"></i>
          <p>${icon.name}</p>
        </div>
        `)}
      </div>
    `
  })
  return result;
}

/**
 * 生成可预览字体图标的 html 页面
 * @param {String} fontUrl 字体地址
 * @param {Object} fontIconsMap 字体图标列表
 * @returns string
 */
const createHTML = (fontUrl, fontIconsMap) => {
  const styleHtml = createStyleHtml(fontUrl);
  const bodyHtml = createBodyHtml(fontIconsMap);
  const html = createPageHtml(styleHtml, bodyHtml);
  return html;
}
export default createHTML;
