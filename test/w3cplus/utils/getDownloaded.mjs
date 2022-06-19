import path from 'path';
import { getThisDir, forEachDir } from '../../../utils/paths.mjs';

const thisDir = getThisDir();
const tempDir = path.join(thisDir, 'temp');

// 获取已下载完成的文章
const getDownloaded = async () => {
  const result = [];
  forEachDir(tempDir, file => {
    if (file.ext === '.html') {
      result.push(file);
    }
  });
  return result;
};
export default getDownloaded;
