(function() {
  const _colorConfig = {
    bright: '\x1B[1m',
    grey: '\x1B[2m',
    italic: '\x1B[3m',
    underline: '\x1B[4m',
    reverse: '\x1B[7m',
    hidden: '\x1B[8m',
    black: '\x1B[30m',
    red: '\x1B[31m',
    green: '\x1B[32m',
    yellow: '\x1B[33m',
    blue: '\x1B[34m',
    magenta: '\x1B[35m',
    cyan: '\x1B[36m',
    white: '\x1B[37m',
    blackBG: '\x1B[40m',
    redBG: '\x1B[41m',
    greenBG: '\x1B[42m',
    yellowBG: '\x1B[43m',
    blueBG: '\x1B[44m',
    magentaBG: '\x1B[45m',
    cyanBG: '\x1B[46m',
    whiteBG: '\x1B[47m'
  };

  const strPro = String.prototype;
  for (let color in _colorConfig) {
    Object.defineProperty(strPro, color, {
      get: function() {
        return _colorConfig[color] + this + '\x1B[0m';
      }
    });

    // 可惜 __defineGetter__ 已被废弃，不然多漂亮呀
    // strPro.__defineGetter__(color, function () {
    //   return _colorConfig[color] + this + '\x1B[0m';
    // });
  }
})();

process.argv[2] === 'test' && console.log('这是红色'.red);

// https://www.cnblogs.com/lienhua34/p/5018119.html
// var _colorConfig2 = {
//   'bold'          : ['\x1B[1m',  '\x1B[22m'],
//   'italic'        : ['\x1B[3m',  '\x1B[23m'],
//   'underline'     : ['\x1B[4m',  '\x1B[24m'],
//   'inverse'       : ['\x1B[7m',  '\x1B[27m'],
//   'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
//   'white'         : ['\x1B[37m', '\x1B[39m'],
//   'grey'          : ['\x1B[90m', '\x1B[39m'],
//   'black'         : ['\x1B[30m', '\x1B[39m'],
//   'blue'          : ['\x1B[34m', '\x1B[39m'],
//   'cyan'          : ['\x1B[36m', '\x1B[39m'],
//   'green'         : ['\x1B[32m', '\x1B[39m'],
//   'magenta'       : ['\x1B[35m', '\x1B[39m'],
//   'red'           : ['\x1B[31m', '\x1B[39m'],
//   'yellow'        : ['\x1B[33m', '\x1B[39m'],
//   'whiteBG'       : ['\x1B[47m', '\x1B[49m'],
//   'greyBG'        : ['\x1B[49;5;8m', '\x1B[49m'],
//   'blackBG'       : ['\x1B[40m', '\x1B[49m'],
//   'blueBG'        : ['\x1B[44m', '\x1B[49m'],
//   'cyanBG'        : ['\x1B[46m', '\x1B[49m'],
//   'greenBG'       : ['\x1B[42m', '\x1B[49m'],
//   'magentaBG'     : ['\x1B[45m', '\x1B[49m'],
//   'redBG'         : ['\x1B[41m', '\x1B[49m'],
//   'yellowBG'      : ['\x1B[43m', '\x1B[49m']
// };
