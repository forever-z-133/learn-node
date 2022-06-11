import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';

// 本项目的根目录
export const rootPath = path.resolve(process.cwd());

// 桌面目录
export const desktopPath = path.resolve('C:\\Users\\61775\\Desktop');

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

// 缓存数据
export const useCache = fn => {
  const cache = {};
  return (...args) => {
    var key = args.length + JSON.stringify(args);
    if (key in cache) return cache[key];
    return (cache[key] = fn(...args));
  };
};

// 递归所有的文件，注意先遍历到的是最内部的文件
const ignoreDirs = ['node_modules'];
export function forEachDir(dir, fileCallback, dirCallback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (ignoreDirs.includes(file)) return;
    const uri = path.join(dir, file);
    const isDirectory = fs.statSync(uri).isDirectory();
    if (!isDirectory) {
      fileCallback && fileCallback(uri);
    } else {
      forEachDir(uri, fileCallback, dirCallback);
      dirCallback && dirCallback(uri);
    }
  });
}

// 获取已下载的番号
const mineDirs = ['E:\\bad', 'E:\\FH', 'E:\\下载2', 'E:\\下载3', 'I:\\下载过', 'I:\\无码', 'I:\\有码', 'I:\\写真'];
export const hasDownload = useCache(dirs => {
  if (typeof dirs === 'string') dirs = [dirs];
  dirs = dirs || mineDirs;
  return dirs.reduce((re, dir) => {
    const f = fs.readdirSync(dir) || [];
    const files = f.map(file => {
      const data = path.parse(file);
      const { base, ext, name } = data;
      return { base, ext, name, dir, path: path.join(dir, base) };
    });
    return re.concat(files);
  }, []);
});
