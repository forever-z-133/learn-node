const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const spawn = require("cross-spawn");
const { exec, execSync } = require("child_process");
const { download, removeDirSync, getFileName, forEachAsync } = require("../../utils");

/**
 * 根据 m3u8 文件下载 ts，并拼成 mp4 文件
 */

const [url] = process.argv.slice(2);
m3u8ToMp4(url, __dirname);
// m3u8ToMp4('https://hd1.o0omvo0o.com/rh/898C29A1/SD/playlist.m3u8', __dirname);
// m3u8ToMp4('http://videozmcdn.stz8.com:8091/20191123/DA989QYe/1000kb/hls/index.m3u8', __dirname);

async function m3u8ToMp4(filePath, outputPath) {
  const outputName = "new";

  // 生成临时文件夹，存放临时下载的东西
  let tempDir = path.join(outputPath, "temp");
  !fs.existsSync(tempDir) && fs.mkdirSync(tempDir);

  // 获取 m3u8 文件的内容
  const m3u8FilePath = await download(filePath, tempDir);
  const m3u8Content = fs.readFileSync(m3u8FilePath, "utf8");

  // 获取下载时的网上文件路径
  const postUrl = path.join(filePath, "../");

  // 可能 m3u8 里还包着 m3u8
  const anotherM3U8 = m3u8Content.match(/^.+\.m3u8/gm);
  if (anotherM3U8) {
    const filePathDir = filePath.split("/").slice(0, -1).join("/");
    let anotherFilePath = anotherM3U8[0];
    anotherFilePath = path.join(filePathDir, anotherFilePath);
    return m3u8ToMp4(anotherFilePath, outputPath);
  }

  // 要下载的 ts 文件列表
  let list = m3u8Content.match(/^.+\.ts/gm);
  if (!list) throw new Error("匹配错误");
  list = list.map((item) => new URL(item, postUrl).href);

  // 已完成的文件，中断的话并不会清掉原文件，有点难搞
  const haslist = fs.readdirSync(tempDir);

  // 下载小 ts 文件，且同时下载多条
  forEachAsync(
    list,
    async (index, url, next) => {
      const fileName = getFileName(url);
      if (!fileName) throw new Error("名称有误");
      if (haslist.includes(fileName)) return next(fileName);
      console.log("download...", url, `${Math.ceil((index / list.length) * 100)}%`);
      await download(url, tempDir, fileName);
      return next(fileName);
    },
    {
      number: 8,
      finish: loaded,
    }
  );

  // 全部下载完成
  function loaded(fileNames) {
    console.log("files download finish");
    // _merge(fileNames, () => {
    //   const oname = outputName + ".ts";
    //   fs.renameSync(path.join(tempDir, oname), path.join(outputPath, oname));
    //   removeDirSync(tempDir);
    //   tsToMp4();
    // });
  }

  // 合并小 ts 文件为 new.ts
  function _merge(fileNames, callback) {
    try {
      let command = `copy /b temp/* ${outputName}.ts`;
      const bat = execSync(command);
      console.log(bat.toString("utf8"));
    } catch (err) {
      console.log(err);
    }
    // 好像有权限问题，新电脑用不了，之后再研究
    // const bat = execSync('cmd.exe', ['/c', command]);
    // bat.on('exit', code => {
    //   if (code) return console.error('cmd 退出码：' + code);
    //   console.log('cmd finish');
    //   callback && callback();
    // });
  }

  // 将 new.ts 转为 new.mp4
  function tsToMp4(callback) {
    spawn("explorer.exe", [outputPath]);
    const command = 'msg * "ts 转 mp4 还没完成，已可用格式工厂将 new.ts 转为想要的格式"';
    spawn("cmd.exe", ["/c", command]);

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
