const path = require("path");
const { exec, execSync } = require("child_process");

const m3u8Path = "https://vod12.zjxxjt.com:8081/20200910/pwpDPVJ0/600kb/hls/index.m3u8";
const command = `ffmpeg -i "${m3u8Path}" -vcodec copy -acodec copy -absf aac_adtstoasc output.mp4`;
try {
  const result = execSync(command);
  console.log(result);
} catch (err) {
  console.log(err.message);
}
