const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const https = require('https');
const child_process = require('child_process');
const args = process.argv.slice(2);


/**
 * 根据 m3u8 文件下载 ts，并拼成 mp4 文件
 */

const [url] = args;
m3u8ToMp4(url, __dirname);
// m3u8ToMp4('https://hd1.o0omvo0o.com/rh/898C29A1/SD/playlist.m3u8', __dirname);

async function m3u8ToMp4(filePath, outputPath) {
  const outputName = 'new';

  // 生成临时文件夹，存放临时下载的东西
  let tempDir = path.join(outputPath, "temp");
  !fs.existsSync(tempDir) && fs.mkdirSync(tempDir);

  // 获取 m3u8 文件的内容
  const m3u8FilePath = await download(filePath, tempDir);
  const m3u8Content = fs.readFileSync(m3u8FilePath, 'utf8');

  // 获取下载时的网上文件路径
  const postUrl = path.join(filePath, '../');

  // 要下载的 ts 文件列表
  let list = m3u8Content.match(/^.+\.ts/gm);
  if (!list) throw new Error('匹配错误');
  list = list.map(item => new URL(item, postUrl).href);

  // 已完成的文件，中断的话并不会清掉原文件，有点难搞
  const haslist = fs.readdirSync(tempDir);

  // 下载小 ts 文件，且同时下载多条
  forEachAsync(list, async (index, url, next) => {
    const fileName = getFileName(url);
    if (!fileName) throw new Error('名称有误');

    if (haslist.includes(fileName)) return next(fileName);

    console.log('download...', url, `${Math.ceil(index/list.length*100)}%`);
    await download(url, tempDir, fileName);
    return next(fileName);
  }, {
    number: 8,
    finish: loaded
  });

  // 全部下载完成
  function loaded(fileNames) {
    console.log('files download finish');
    _merge(fileNames, () => {
      const oname = outputName + '.ts';
      fs.renameSync(path.join(tempDir, oname), path.join(outputPath, oname));
      removeDirSync(tempDir);
      tsToMp4();
    });
  }

  // 合并小 ts 文件为 new.ts
  function _merge(fileNames, callback) {
    let command = `copy /b ${fileNames.join('+')} ${outputName}.ts`;
    const bat = child_process.spawn('cmd.exe', ['/c', command], {
      cwd: tempDir
    });
    bat.on('exit', (code) => {
      if (code) throw new Error('cmd 退出码：' + code);
      console.log('cmd finish');
      callback && callback();
    });
  }

  // 将 new.ts 转为 new.mp4
  function tsToMp4(callback) {

    child_process.spawn('explorer.exe', [outputPath]);
    child_process.spawn('cmd.exe', ['/c', 'msg * "ts 转 mp4 还没完成，已可用格式工厂将 new.ts 转为想要的格式"']);

    // const ffmpeg_path = join('./libs/ffmpeg');

    // const ts_path = path.join(tempDir, 'new.ts');
    // const command = `${ffmpeg_path} -i ${ts_path} -vcodec copy -acodec copy ${ts_path.replace('ts', 'mp4')}`;
    // child_process.execSync(command, (err) => {
    //   console.log(err.message.toString('ascii'));
    // });
    // console.log(a);

    // const new_ffmpeg_path = path.join(tempDir, 'ffmpeg');
    // fs.copyFileSync(ffmpeg_path, new_ffmpeg_path);
    // const command = `ffmpeg -i new.ts -vcodec copy -acodec copy new.mp4}`;
    // const bat = child_process.spawn('cmd.exe', ['/c', command], { cwd: tempDir });
    // bat.stdout.on('data', (data) => {
    //   console.log(data.toString('ascii'));
    // });
    // bat.on('exit', (code, b) => {
    //   if (code) throw new Error('cmd 退出码：' + code);
    //   console.log('cmd finish');
    //   callback && callback();
    // });
  }
}

// 删除文件夹，包括其下所有文件及文件夹
function removeDirSync(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(file => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    fs.rmdirSync(path);
  }
}

// 获取文件名称
function getFileName(filePath) {
  return filePath.slice(filePath.lastIndexOf('/') + 1);
}

// 下载文件
function download(url, output, fileName) {
  return new Promise(resolve => {
    fileName = fileName || url.slice(url.lastIndexOf('/'));
    if (!fileName) throw new Error('没找到文件名');
    const filePath = path.join(output, fileName);
    const stream = fs.createWriteStream(filePath);
    https.get(url, (res) => {
      res.on('data', (chunk) => {
        stream.write(chunk);
      });
      res.on('end', () => {
        stream.end();
        resolve(filePath);
      });
    });
  });
}

// 异步循环
function forEachAsync(data, func, options) {
  options = options || {};
  const timesConfig = Math.min(options.number || 5, 8); // 最大线程数
  const total = data.length - 1;
  const result = [];

  let restQueue = timesConfig; // 剩余队列数
  let started = 0; // 已发起
  let loaded = 0; // 已完成
  (function loop(index) {
    const item = data[index];
    if (!item) return;
    func(index, item, res => {
      restQueue++;
      result[index] = res;
      if (++loaded > total) return finish(result);
      loop(++started);
    });
    if (--restQueue > 0) loop(++started);
  })(0);

  // 全部运行完成
  function finish(result) {
    options.finish && options.finish(result);
  }
}