const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const inquirer = require("inquirer");
const spawn = require("cross-spawn");
const { download, makeDirSync, forEachAsync, getFileName, emptyDirSync, removeFileSync } = require("../../utils");
const netTaskCount = 8; // 同时请求的线程数

/// 测试链接
// https://209zy.suyunbo.tv/2020/09/25/r2Y8Ij9eIfkXTXeg/playlist.m3u8
// https://hd1.o0omvo0o.com/rh/898C29A1/SD/playlist.m3u8
// https://yiqikan.wuyouzuida.com/20200807/6046_b880ae10/index.m3u8

/**
 * 根据 m3u8 链接下载 ts，合并后转为 mp4 文件
 */
(async function () {
  // 生成临时文件夹，存放临时下载的东西
  const tempDir = path.join(__dirname, "temp");
  makeDirSync(tempDir);

  // 询问是否清空文件夹
  await askForEmptyTempDir(tempDir);

  // 询问用哪个 m3u8 链接
  let [url] = process.argv.slice(2);
  if (!url) url = await askForM3u8Url();

  // 获取要下载的所有 ts 文件
  const tsUrls = await getAllTsUrl(url);
  if (tsUrls.length < 1) throw new Error("匹配错误");

  // 下载好所有 ts 文件
  await downloadAllTsUrls(tsUrls);
  console.log("所有 ts 文件下载完成");

  // 全部下载完成后，删除原 output.ts，将 ts 文件合并为整个 output.ts
  const tsOutputFilePath = path.join(tempDir, "output.ts");
  removeFileSync(tsOutputFilePath);
  const command = `copy /b ts\\* output.ts`;
  spawn.sync("cmd.exe", ["/c", `cd /d ${tempDir} && ${command}`]);
  console.log("合并脚本完成");

  // 将 output.ts 转化为 output.mp4
  await tsToMp4(tsOutputFilePath);
  spawn.sync("cmd.exe", ["/c", `start ${tempDir}`]);
})();

// 根据 m3u8 文件获取所有的 ts 文件，m3u8 文件放在 temp/ts 文件夹中
async function getAllTsUrl(m3u8Url) {
  const result = [];
  const postUrl = path.join(m3u8Url, "../");

  // 下载的 m3u8 文件放在 temp/m3u8 文件夹中
  const tempDir = path.join(__dirname, "temp/m3u8");
  makeDirSync(tempDir);

  // 获取 m3u8 文件的内容
  const m3u8FilePath = await download(m3u8Url, tempDir);
  const m3u8Content = fs.readFileSync(m3u8FilePath, "utf8");

  // 可能 m3u8 里还包着 m3u8，则递归
  const anotherM3U8 = m3u8Content.match(/^.+\.m3u8/gm);
  if (anotherM3U8 && anotherM3U8.length) {
    console.log(m3u8Content);
    for await (let m3u8FileName of anotherM3U8) {
      const otherM3u8Url = new URL(m3u8FileName, postUrl).href;
      console.log(otherM3u8Url);
      const otherTsUrls = await getAllTsUrl(otherM3u8Url);
      [].push.apply(result, otherTsUrls);
    }
  }

  // 要下载的 ts 链接列表
  const list = m3u8Content.match(/^.+\.ts/gm);
  if (list && list.length) {
    list.forEach((tsFileName) => {
      const tsUrl = new URL(tsFileName, postUrl).href;
      result.push(tsUrl);
    });
  }

  return result;
}

// 下载所有的 ts 文件，放在 temp/ts 文件夹中
function downloadAllTsUrls(tsUrls) {
  const tempDir = path.join(__dirname, "temp/ts");
  makeDirSync(tempDir);

  // 获取已下载的 ts 文件（中断或错误的文件暂无办法排查，难搞）
  const hasList = fs.readdirSync(tempDir);

  // 开始下载
  const total = tsUrls.length;
  return new Promise((resolve) => {
    forEachAsync(
      tsUrls,
      async (index, url, next) => {
        const fileName = getFileName(url);
        if (!fileName) throw new Error("名称有误");
        if (hasList.includes(fileName)) {
          // 已下载
          // console.log("downloaded", url, `${Math.floor((index / total) * 100)}%`);
          return next(fileName);
        } else {
          // 去下载
          console.log("download...", url, `${Math.floor((index / total) * 100)}%`);
          await download(url, tempDir, fileName);
          return next(fileName);
        }
      },
      {
        number: netTaskCount,
        finish: resolve,
      }
    );
  });
}

// 询问是否清空文件夹，并操作
async function askForEmptyTempDir(dir) {
  const question = [
    {
      type: "list",
      name: "isEmptyDir",
      choices: ["否", "是"],
      message: `是否清空文件夹？`,
    },
  ];
  const result = await inquirer.prompt(question);
  const { isEmptyDir } = result || {};
  if (isEmptyDir === "是") emptyDirSync(dir);
}

// 将 ts 文件转化为 mp4 文件
function tsToMp4(tsFilePath) {
  return new Promise((resolve) => {
    resolve(tsFilePath);
  });
}

// 询问要处理的 m3u8 链接
async function askForM3u8Url() {
  const question = [
    {
      type: "input",
      name: "m3u8Url",
      message: `想要处理的 m3u8 链接：`,
    },
  ];
  const result = await inquirer.prompt(question);
  const { m3u8Url } = result || {};
  return m3u8Url;
}
