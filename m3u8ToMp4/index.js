const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const https = require('https');
const child_process = require('child_process');
const args = process.argv.slice(2);


/**
 * 根据 m3u8 文件下载 ts，并拼成 mp4 文件
 */

const [ url ] = args;
m3u8ToMp4(url, __dirname);
// m3u8ToMp4('https://hd1.o0omvo0o.com/rh/898C29A1/SD/playlist.m3u8', __dirname);

async function m3u8ToMp4(filePath, outputPath) {
  // 生成临时文件夹，存放临时下载的东西
  let tempDir = path.join(outputPath, "temp");
  !fs.existsSync(tempDir) && fs.mkdirSync(tempDir);

  // 下载 m3u8 文件
  const { txt } = await download(filePath, tempDir);
  const postUrl = path.join(filePath, '../');

  // 已完成的文件，比如中断等原因
  const haslist = fs.readdirSync(tempDir);

  // 要下载的 ts 文件列表
  let list = txt.match(/^.+\.ts/gm);
  if (!list) throw new Error('匹配错误');
  list = list.map(item => new URL(item, postUrl).href);

  // 下载小 ts 文件，且同时下载多条
  forEachAsync(list, {
    customAjax: async (url, next) => {
      const fileName = (url.match(/\w+.ts/) || [])[0];
      if (!fileName) throw new Error('名称有误');

      console.log('download...', url);
      if (haslist.includes(fileName)) return next(fileName);

      await download(url, tempDir, fileName, () => {});
      return next(fileName);
    },
    finish: loaded
  });

  // 全部下载完成
  function loaded(fileNames) {
    console.log('files download finish');
    _merge(fileNames, toMp4);
  }

  // 合并小 ts 文件为 new.ts
  function _merge(fileNames, callback) {
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

// 下载文件
function download(url, output, fileName, callback) {
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
        const txt = fs.readFileSync(filePath, 'utf8');
        callback ? callback() : resolve({ filePath, txt });
      });
    });
  });
}

// 异步循环，但需要自己写 customAjax 异步过程
function forEachAsync(data, options) {
  options = options || {};
  var timesConfig = Math.min(options.number || 5, 8); // 最大线程数

  var rest = timesConfig; // 剩余线程数
  var current = 0; // 当前已进行索引（未必已完成）
  var result = []; // 结果数据
  (function loop(index) {
    const item = data[index];
    if (!item) return;
    rest--;
    if (rest < 0) return;

    _ajax(item, function (res) {
      rest++;
      result[index] = res || item;
      if (current > data.length - 1 && rest === timesConfig) return finish(result);
      // 注意：_ajax 必须异步，不然这个 loop 会先于下面的 loop
      setTimeout(() => {
        loop(++current);
      }, 1);
    })

    if (rest > 0) loop(++current);
  })(0);

  // 每次一个数据，走完则回调
  function _ajax(item, next) {
    if (options.customAjax) {
      return options.customAjax(item, next, current);
    }
  }

  // 全部运行完成
  function finish(result) {
    options.finish && options.finish(result);
  }
}