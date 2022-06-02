import trash from 'trash';
import '../test/consoleColor/index.js';

export const throwError = msg => {
  console.log(msg.red);
  process.exit(0);
};

export const removeSync = async uri => {
  return await trash([uri]);
};
