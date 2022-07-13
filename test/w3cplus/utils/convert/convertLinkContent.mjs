import addBaseUrl from '../other/addBaseUrl.mjs';
import forEachDom from '../other/forEachDom.mjs';

// 处理正文内容
const convertLinkContent = ($, $content) => {
  // 处理 ./ 等类型链接
  const $links = $content.find('a');
  forEachDom($, $links, $link => {
    const href = $link.attr('href') || '';
    const newHref = addBaseUrl(href);
    $link.attr('href', newHref);
  });
};
export default convertLinkContent;
