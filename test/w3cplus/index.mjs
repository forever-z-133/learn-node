import getLinksListCount from './utils/getLinksListCount.mjs';
import getLinksList from './utils/getLinksList.mjs';
import { forEachAsync } from '../../utils/index.mjs';

const getAllLinksList = count => {
  const array = new Array(count).fill();
  return forEachAsync(array, async (_, index, next) => {
    const pageUrl = `https://www.w3cplus.com/?page=${index}`;
    console.log('请求中', pageUrl);
    const links = await getLinksList(pageUrl);
    next(links);
  });
};

const run = async () => {
  const count = 2 || await getLinksListCount();
  const links = await getAllLinksList(count);
  console.log(links);
};

run();
