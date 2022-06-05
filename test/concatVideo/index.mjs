import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';
import { throwError } from '../../utils/others.mjs';
import { desktopPath, getThisDir } from '../../utils/paths.mjs';
import getVideos from './utils/getVideos.mjs';
import '../consoleColor/index.js';

const thisPath = getThisDir();
const tempDir = path.join(thisPath, 'temp');
const txtPath = path.join(tempDir, 'video.txt');
const outputPath = path.join(desktopPath, 'output.mp4');

const run = flags => {
  const videos = getVideos(flags);
  if (!videos.length) throwError('入参有误，未能获取到可用的视频名称');

  const input = videos.map(v => `file ${v.replace(/\\/g, '/')}`).join('\n');
  fs.ensureDirSync(tempDir);
  fs.writeFileSync(txtPath, input, 'utf8');

  spawn.sync('cmd.exe', ['/c', `ffmpeg -y -f concat -safe 0 -i ${txtPath} -c copy ${outputPath}`], { stdio: 'inherit' });
};
export default run;
