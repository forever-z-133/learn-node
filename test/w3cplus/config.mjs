import path from 'path';
import { objectToString } from '../../utils/index.mjs';
import { ensureDirSync } from 'fs-extra';
import { getThisDir } from '../../utils/paths.mjs';

const thisDir = getThisDir();

export const tempDir = path.join(thisDir, 'temp');
ensureDirSync(tempDir);

export const baseUrl = 'https://www.w3cplus.com';
export const expire = 1657704791;
export const code = 'Iad02ismi78';
export const sign = '419ad25ab71b78febe840710880e646d';

const authorization = objectToString({ expire, code, sign });
export default authorization;
