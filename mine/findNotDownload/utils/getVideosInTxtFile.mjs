import fs from 'fs';
import { getCodeName, convertCodeName } from '../../../utils/mine.mjs';

/**
 * 根据 txt 文件，读取其中番号
 * @param {String} uri 文件路径
 * @returns { errorLinks, matchLinks }
 */
const getVideosInTxtFile = uri => {
  const txt = fs.readFileSync(uri, 'utf8');
  const links = txt.match(/magnet:\?.+/g);

  let errorLinks = [];
  let matchLinks = [];

  links.forEach(link => {
    const pureName = getCodeName(link);
    if (!pureName) {
      errorLinks.push({ url: link, name: pureName });
      return;
    }
    const name = convertCodeName(pureName);
    matchLinks.push({ url: link, name });
  });

  errorLinks = errorLinks.sort((a, b) => (a.name < b.name ? -1 : 1));
  matchLinks = matchLinks.sort((a, b) => (a.name < b.name ? -1 : 1));

  return { errorLinks, matchLinks };
};
export default getVideosInTxtFile;
