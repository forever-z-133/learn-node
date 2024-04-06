import fs from 'fs-extra';
import path from 'path';
import { getThisDir } from '../../../utils/paths.mjs';

const thisPath = getThisDir();
const templateFilePath = path.join(thisPath, 'utils/template.html');

function createHTMLFile(data, outputPath) {
  const template = fs.readFileSync(templateFilePath, 'utf8');
  const htmlStr = template.replace('{/* data */}', JSON.stringify(data));
  fs.writeFileSync(outputPath, htmlStr);
}
export default createHTMLFile;
