import path from 'path';
import fs from 'fs-extra';
import { getThisDir } from '../../../utils/paths.mjs';

const thisDir = getThisDir();
const tempDir = path.resolve(thisDir, '../temp');

const isNetFile = url => {
  return /^https?:\/\//.test(url);
}

const getTempFile = async url => {

}
export default getTempFile;
