import { hasIconContent, hasFamilyName } from './getFontIconsData.mjs';
import { isNetFile } from './getTempFile.mjs';

describe('test/previewFont/utils', () => {
  test('isNetFile', () => {
    expect(isNetFile('')).toBe(false);
    expect(isNetFile('./createHtml.mjs')).toBe(false);
    expect(isNetFile('D:/zbooks/learn-node/test/previewFont/bootstrap/bootstrap.css')).toBe(false);
    expect(isNetFile('https://cdn.bootcss.com/twitter-bootstrap/3.4.1/css/bootstrap.min.css')).toBe(true);
  });

  test('hasIconContent', () => {
    expect(hasIconContent('')).toBe(false);
    expect(hasIconContent('content:""')).toBe(false);
    expect(hasIconContent('content:"xxs"')).toBe(false);
    expect(hasIconContent('content:"\\e632"')).toBe(true);
  });

  test('hasFamilyName', () => {
    const check1 = hasFamilyName('iconfont');
    expect(check1('font-family: "iconfont" !important;font-size: 16px;font-style: normal;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;')).toBe(true);
    const check2 = hasFamilyName('FontAwesome 4');
    expect(check2('filter:alpha(opacity=0);-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";-moz-opacity:0;-khtml-opacity:0;opacity:0;pointer-events:none;transition:all 0.18s ease-out 0.18s;font-family:sans-serif !important;font-weight:normal !important;font-style:normal !important;text-shadow:none !important;font-size:.8rem !important;background:rgba(33,37,41,0.9);border-radius:4px;color:#fff;content:attr(data-balloon);padding:.5em 1em;position:absolute;white-space:nowrap;z-index:10')).toBe(false);
    expect(check2('-ms-overflow-style:-ms-autohiding-scrollbar;font-family:fa5-proxima-nova,"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:14px')).toBe(false);
    expect(check2('font-family:sans-serif;font-size:100%;line-height:1.15;margin:0')).toBe(false);
    expect(check2('display:inline-block;font:normal normal normal 14px/1 \'FontAwesome 4\';font-size:inherit;text-rendering:auto;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale')).toBe(true);
  });
});
