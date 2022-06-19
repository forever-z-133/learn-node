import getDownloaded from './getDownloaded.mjs';
import getLinksList from './getLinksList.mjs';
import { getCacheLinksList } from './manageCacheLinksList.mjs';

const getNewLinksList = async (cached, page = 0, result = []) => {
  const pageUrl = `https://www.w3cplus.com/?page=${page}`;
  console.log('请求中', pageUrl);
  const links = await getLinksList(pageUrl);
  const isCache = link => cached.find(e => e.name === link.name);
  const newLinks = links.filter(link => !isCache(link));
  result.push(...newLinks);
  if (newLinks.length >= links.length) {
    return getNewLinksList(cached, page + 1, result);
  }
  return result;
};

const getNeedDownload = async () => {
  // 先处理最新的链接
  const cached = await getCacheLinksList();
  const newLinks = await getNewLinksList(cached);
  console.log('newLinks', newLinks);

  // 再处理有链接但还没爬取的
  const downloaded = await getDownloaded();
  console.log('downloaded', downloaded);
};
export default getNeedDownload;
