import path from 'path';
import { getThisDir } from '../../../utils/paths.mjs';

const thisDir = getThisDir();
const tempDir = path.resolve(thisDir, '../temp');

const isNetFile = url => {
  return /^https?:\/\//.test(url);
};

const getTempFile = async url => {
  return path.normalize(url);
};
export default getTempFile;
