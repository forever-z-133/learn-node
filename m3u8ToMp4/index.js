const fs = require('fs');
const path = require('path');
const {
  URL
} = require('url');
const https = require('https');
const child_process = require('child_process');


/**
 * 根据 m3u8 文件下载 ts，并拼成 mp4 文件
 */

const join = (name) => path.join(__dirname, name);
m3u8ToMp4(join('./playlist.m3u8'), join('./'));

function m3u8ToMp4(filePath, outputPath) {
  const txt = fs.readFileSync(filePath, 'utf8');
  const postUrl = 'https://hd1.o0omvo0o.com/rh/898C29A1/SD/';

  // 生成临时文件夹
  let tempDir = path.join(outputPath, "temp");
  !fs.existsSync(tempDir) && fs.mkdirSync(tempDir);

  // 已完成的部分
  const haslist = fs.readdirSync(tempDir);

  // 要下载的 ts 文件列表
  let list = txt.match(/^.+\.ts/gm);
  if (!list) throw new Error('匹配错误');
  list = list.map(item => new URL(item, postUrl).href);
  const listLen = list.length;

  // 下载小 ts 文件，且同时下载多条
  // 空闲数量   当前运行     结果数据
  let rest = 8,
    current = 0;
  const result = [];
  (function loop(index) {
    const url = list[index];
    if (!url) return;

    rest--;
    if (rest < 0) return;

    load(url, (name) => {
      rest++;
      result[index] = name;
      if (current > listLen - 1 && rest === 8) return loaded(result);
      console.log('download...', url);
      loop(++current); // 注意：load 必须异步，不然这个 loop 会先于下面的 loop
    })

    if (rest > 0) loop(++current);
  })(0);

  // 下载单个小 ts 文件
  function load(url, callback) {
    if (typeof callback !== 'function') throw new Error('入参有误');

    const fileName = (url.match(/\w+.ts/) || [])[0];
    if (!fileName) throw new Error('名称有误');

    if (haslist.includes(fileName)) {
      return setTimeout(() => callback(fileName), 1);
    }

    const stream = fs.createWriteStream(path.join(tempDir, fileName));
    https.get(url, (res) => {
      res.on('data', (chunk) => {
        stream.write(chunk);
      });
      res.on('end', () => {
        stream.end();
        callback(fileName);
      });
    });
  }

  // 全部下载完成
  function loaded(fileNames) {
    console.log('files download finish');
    _merge(fileNames, toMp4);
  }

  // 合并小 ts 文件为 new.ts
  function _merge(fileNames, callback) {
    // if (haslist.includes('new.ts')) return callback && callback();

    let command = `copy /b ${fileNames.join('+')} new.ts`;
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
  function toMp4(callback) {

    child_process.spawn('explorer.exe', [tempDir]);
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