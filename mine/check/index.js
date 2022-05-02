const { hasDownload, covertDownloadToMap } = require('../../utils/me');
require('../../test/consoleColor');

const has = hasDownload();

const errors = has.filter(item => {
  const hasTwoDots = item.fileName.includes('..');
  return hasTwoDots;
});

// const map = covertDownloadToMap(has);
// map.forEach((val) => {
//   if (val.length > 1) {
//     errors.push(...val);
//   }
// });

errors.forEach(item => {
  console.log('异常'.red, item.url);
});
