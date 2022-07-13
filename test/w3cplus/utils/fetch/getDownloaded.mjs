import { tempDir } from '../../config.mjs';
import { forEachDir } from '../../../../utils/paths.mjs';

// 获取已下载完成的文章
const getDownloaded = () => {
  const result = [];
  forEachDir(tempDir, file => {
    if (file.endsWith('.html')) {
      result.push(file);
    }
  });
  return result;
};
export default getDownloaded;
