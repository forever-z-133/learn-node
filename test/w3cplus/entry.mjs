import run from './index.mjs';
import getDownloaded from './utils/fetch/getDownloaded.mjs';
import { baseUrl } from './config.mjs';
import { addDataToUrl, forEachAsync } from '../../utils/index.mjs';
import getLinksList from './utils/fetch/getlinkslist.mjs';
import getLinkContent from './utils/fetch/getLinkContent.mjs';

const downloaded = getDownloaded();
console.log(downloaded);

const fetchLinks = async page => {
  const pageUrl = addDataToUrl(baseUrl, { page });
  const list = await getLinksList(pageUrl);
  return list;
};

const onFetchLinkItem = async (item, index, next) => {
  const { title, url } = item;
  const isDownloaded = downloaded.some(file => file.includes(title));
  if (isDownloaded) return next();
  const content = await getLinkContent(url);
  console.log(content);
  next();
};

const entry = async () => {
  const list = await fetchLinks(0);

  forEachAsync(list.slice(0, 1), onFetchLinkItem);

  run();
};

entry();
