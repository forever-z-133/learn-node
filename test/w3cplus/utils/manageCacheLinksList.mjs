import fs from 'fs-extra';
import path from 'path';
import { getThisDir } from '../../../utils/paths.mjs';

const thisDir = getThisDir();
const tempDir = path.join(thisDir, 'temp');
const cacheJsonFile = path.join(tempDir, 'cache.json');

export const getCacheLinksList = () => {
  fs.ensureFileSync(cacheJsonFile);
  try {
    const json = fs.readJSONSync(cacheJsonFile, 'utf8');
    return json;
  } catch (e) {
    return [];
  }
};

export const setCacheLinksList = links => {
  fs.ensureFileSync(cacheJsonFile);
  fs.writeJSONSync(cacheJsonFile, links, { spaces: 2, encoding: 'utf8' });
};
