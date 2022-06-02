import '../test/consoleColor/index.js';

export const throwError = msg => {
  console.log(msg.red);
  process.exit(0);
};
