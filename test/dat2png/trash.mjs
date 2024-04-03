import fs from 'fs';
import path from 'path';

const dir = 'C:/Users/Admin/Desktop/Game/PortraitDynamic/Woman/Body/101';
const inputPath = path.join(dir, 'shou.dat');

try {
  const outputPath = dat2img(inputPath, dir);
  console.log('outputPath:', outputPath);
} catch (err) {
  console.error(err);
}

function dat2img(inputPath, outputDir) {
  const jpg = [0xff, 0xd8];
  const gif = [0x47, 0x49];
  const png = [0x89, 0x50];
  const FileTypes = { jpg, gif, png };

  const dat = fs.readFileSync(inputPath);

  // 取前四位
  const header = dat[0];
  const next = dat[1];

  Object.keys(FileTypes).forEach(fileType => {
    const [first, second] = FileTypes[fileType];
    const v = first ^ header;
    const verify = v ^ next;

    if (verify !== second) return;

    // 对剩余所有字节进行异或解码
    const result = dat.map(item => item ^ v);

    const fileName = path.parse(inputPath).name;
    const outputPath = path.format({
      dir: outputDir,
      name: fileName,
      ext: `.${fileType}`,
    });

    // 保存解码后的文件
    fs.writeFileSync(
      outputPath,
      Buffer.from(result)
    );

    return outputPath;
  });
}
