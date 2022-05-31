import path from 'path';
import { download, getThisDir } from '../../../utils/paths.mjs';

const thisDir = getThisDir();
const tempDir = path.resolve(thisDir, 'temp');

export const isNetFile = url => {
  return /^https?:\/\//.test(url);
};

const getTempFile = async url => {
  if (isNetFile(url)) {
    const fileName = path.basename(url);
    const output = path.resolve(tempDir, fileName);
    await download(url, output);
    return output;
  }
  return path.normalize(url);
};
export default getTempFile;
