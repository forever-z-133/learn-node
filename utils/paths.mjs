import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';

// 本项目的根目录
export const rootPath = path.resolve(process.cwd());

// 桌面目录
export const desktopPath = path.resolve('C:\\Users\\Admin\\Desktop');

// 兼容 __dirname
export const getThisDir = () => path.dirname(process.argv[1]);

// 下载文件
export const download = (url, output, showDetail = false) => new Promise((resolve, reject) => {
  try {
    spawn.sync('cmd.exe', ['/c', `curl -L ${url} -o ${output}`], showDetail ? { stdio: 'inherit' } : undefined);
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

// 递归所有的文件，注意是先遍历到的是最内部的文件
// xpath 用于判断当前位置，比如获取层数或父级
const ignoreDirs = ['node_modules'];
export function forEachDir(dir, fileCallback, dirCallback, _xpath = []) {
  let files = fs.readdirSync(dir);
  files = files.filter(file => !ignoreDirs.includes(file));
  files.forEach(file => {
    const uri = path.join(dir, file);
    const isDirectory = fs.statSync(uri).isDirectory();
    if (!isDirectory) {
      fileCallback && fileCallback(uri, _xpath, file);
    } else {
      forEachDir(uri, fileCallback, dirCallback, [..._xpath, file]);
      dirCallback && dirCallback(uri, _xpath, file);
    }
  });
}

// 获取已下载的番号
const mineDirs = ['F:\\坏', 'E:\\下载3', 'F:\\下载过', 'F:\\无码', 'F:\\有码', 'F:\\麻豆', 'F:\\写真'];
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

// 获取名称相似的番号
export const getSimilar = name => {
  const has = hasDownload();
  const similar = has.filter(file => {
    return file.name.includes(name) || file.name.toLowerCase().includes(name);
  });
  return similar;
};
