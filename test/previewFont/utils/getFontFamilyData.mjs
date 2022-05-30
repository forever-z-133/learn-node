import path from 'path';
import fs from 'fs-extra';

const isNetFile = url => {
  return /^https?:\/\//.test(url);
}

const getFontFamilyData = (cssUrl, cssRules) => {
  return {}
}

export default getFontFamilyData;
