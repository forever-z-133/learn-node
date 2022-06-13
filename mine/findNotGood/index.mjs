import fs from 'fs-extra';
import path from 'path';
import { getSimilar } from '../../utils/paths.mjs';
import { convertCodeName, removeCodeNamePart } from '../../utils/mine.mjs';
import { divideArray } from '../../utils/index.mjs';
import { removeSync } from '../../utils/others.mjs';
import askForUndo from './utils/askForUndo.mjs';
import '../../test/consoleColor/index.js';

const hasDir = 'I:\\下载过';

// 番号文件是否存在于下载过文件夹
const isInHasDir = file => file.dir === hasDir;

const run = async (entryName, undoDelete, undoCreate) => {
  const needCreateFile = path.join(hasDir, `${convertCodeName(entryName)}.txt`);
  let isFirstRun = true;
  let needDelete = [];
  let needCreate = [];

  // 寻找待删除和待新增的文件
  if (undoDelete !== undefined) {
    isFirstRun = false;
    needDelete = undoDelete;
    needCreate = undoCreate;
  } else {
    const similar = getSimilar(entryName);
    const [alreadyExist, needDeleteFiles] = divideArray(similar, isInHasDir);
    const alreadyCreate = alreadyExist.find(file => removeCodeNamePart(file.name) === entryName);
    needDelete = needDeleteFiles.map(file => file.path);
    needCreate = alreadyCreate ? [] : [needCreateFile];
  }

  // 询问具体操作哪个文件，直到所有文件处理完
  if (needCreate.length > 0 || needDelete.length > 0) {
    const { method, url } = await askForUndo(entryName, needDelete, needCreate);

    switch (method) {
      case 'remove': {
        await removeSync(url);
        console.log('删除成功'.red, url);
        needDelete = needDelete.filter(e => url !== e);
        break;
      }
      case 'create': {
        fs.writeFileSync(url, '', 'utf8');
        console.log('新增成功'.green, url);
        needCreate = needCreate.filter(e => url !== e);
        break;
      }
      case 'cancel':
      default: {
        process.exit(0);
      }
    }

    await run(entryName, needDelete, needCreate);
  } else if (isFirstRun) {
    console.log('已存在', needCreateFile);
  }
};
export default run;
