import spawn from 'cross-spawn';
import pathsConfig from '../config/paths.mjs';
import '../test/consoleColor/index.js';

const run = (...args) => {
  const [key = '', ...options] = args;

  if (!pathsConfig.hasOwnProperty(key)) {
    throw new Error(`该脚本【${key.red}】不在配置中，请校正入参，或查看 config/paths.mjs`);
  }

  const subCommandPath = pathsConfig[key];
  const command = `node ${subCommandPath} ${options.join(' ')}`;

  console.log(command);
  spawn.sync('cmd.exe', ['/c', command], { stdio: 'inherit' });
}
export default run;
