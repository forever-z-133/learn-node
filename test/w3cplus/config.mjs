import { objectToString } from '../../utils/index.mjs';

export const baseUrl = 'https://www.w3cplus.com';
export const expire = 1640524156;
export const code = 'FbsWzMoPxg4';
export const sign = '79458f2dec5cdde336e04824eaf0cefa';

const authorization = objectToString({ expire, code, sign });
export default authorization;
