import fs from 'fs-extra';
import path from 'path';
import { desktopPath } from '../../../utils/paths.mjs';

// 判断是不是 1.mp4 格式
const numberVideoReg = /^\d+\.(mp4|rmvb|avi|wmv|mkv)/;
const isNumberFileName = file => numberVideoReg.test(file);

// 自动获取桌面上的 1.mp4 等视频
const autoGetVideoAtDesktop = () => {
  const f = fs.readdirSync(desktopPath);
  const files = f.filter(isNumberFileName)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    .map(f => path.join(desktopPath, f));
  return files;
};

// 输入的视频名称进行标准化处理
const customGetVideo = flags => {
  const files = flags.trim().split(',').map(f => path.join(desktopPath, f));
  return files;
};

/**
 * 获取要拼凑的视频连接
 * @param {String} flags 视频名称
 * @returns array
 */
const getVideos = flags => {
  if (!flags || !flags.trim().length) {
    return autoGetVideoAtDesktop();
  }
  return customGetVideo(flags);
};
export default getVideos;
