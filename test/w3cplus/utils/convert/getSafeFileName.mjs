
// 获取安全可用的文件名，比如 \/:*?"<>| 字符会造成取名报错
const invalidCharReg = /[\\/:*?"<>|]/g;
const getSafeFileName = name => {
  return name.replace(invalidCharReg, '_');
};
export default getSafeFileName;
