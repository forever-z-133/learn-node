import refreshCache from './refresh-cache.mjs';
import run from './index.mjs';

const arg = process.argv[2];
const needRefreshCache = arg === '-r' || arg === '--refresh-cache';

const entry = async () => {
  if (needRefreshCache) {
    await refreshCache();
  }
  run();
};

entry();
