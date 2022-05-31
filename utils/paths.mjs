import path from 'path';
import spawn from 'cross-spawn';

// 本项目的根目录
export const rootPath = path.resolve(process.cwd());

// 导出文件目录连接方法
export const resolve = uri => path.resolve(rootPath, uri);

// 兼容 __dirname
export const getThisDir = () => path.dirname(process.argv[1]);

// 下载文件
export const download = (url, output) => new Promise((resolve, reject) => {
  try {
    spawn.sync('cmd.exe', ['/c', `curl -L ${url} -o ${output}`]);
    resolve();
  } catch(err) {
    reject(err);
  }
});
