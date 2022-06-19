import getLinksListCount from './utils/getLinksListCount.mjs';
import getLinksList from './utils/getLinksList.mjs';
import { forEachAsync, sleep } from '../../utils/index.mjs';
import { setCacheLinksList } from './utils/manageCacheLinksList.mjs';

const thread = 8;

const onGetOneLinksList = async (_, index, next) => {
  const pageUrl = `https://www.w3cplus.com/?page=${index}`;
  console.log('请求中', pageUrl);
  const links = await getLinksList(pageUrl);
  await sleep(Math.random() * 100);
  next(links);
};

// 由于无论从哪个方向开始检查都要加载全部才好判断，因此直接缓存全部
// 只判断最开始的几条，若不存在则为最新的需下载
const refreshCache = async () => {
  const count = await getLinksListCount();
  console.log('总页数', count);
  const array = new Array(count).fill();
  const totalLinks = await forEachAsync(array, onGetOneLinksList, { thread });
  const cacheLinks = totalLinks.flat();
  setCacheLinksList(cacheLinks);
};
export default refreshCache;
