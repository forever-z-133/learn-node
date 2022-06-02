import fs from 'fs-extra';
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

// 递归所有的文件，注意先遍历到的是最内部的文件
export function forEachDir(dir, dirCallback, fileCallback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const uri = path.join(dir, file);
    if (fs.statSync(uri).isDirectory()) {
      // 如果自己是文件夹，则先继续递归，然后再处理自身
      forEachDir(uri, dirCallback, fileCallback);
      dirCallback && dirCallback(uri);
    } else {
      fileCallback && fileCallback(uri);
    }
  });
}
