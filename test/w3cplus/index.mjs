import getLinksListCount from './utils/getLinksListCount.mjs';
import getLinksList from './utils/getLinksList.mjs';
import { uniquePush as unique, forEachAsync } from '../../utils/index.mjs';
import { getCacheLinksList } from './utils/manageCacheLinksList.mjs';

// 保持 array 值唯一的  push
const uniquePush = unique((item, index, array) => !array.some(e => e.name === item.name));

const cacheLinks = await getCacheLinksList();

const getOneLinksList = async (page = 0) => {
  const pageUrl = `https://www.w3cplus.com/?page=${page}`;
  console.log('请求中', pageUrl);
  const links = await getLinksList(pageUrl);
  return links;
};

const loopForGetLinksList = async (page = 0, total = 10) => {
  if (page > total) return;
  const links = await getOneLinksList(page);
  const isCached = cacheLinks.find(a => links.find(b => b.name === a.name));
  page += 1;
};

const run = async () => {
  // console.log(cache);
  // const count = await getLinksListCount();
  // console.log(count);
  // const links = await getAllLinksList(2);
  // console.log(links);
};

run();
