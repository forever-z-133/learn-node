
const forEachDom = ($, $list, callback) => {
  let i = 0;
  let item;
  while ((item = $list[i++]) !== undefined) {
    const $item = $(item);
    callback && callback($item);
  }
};
export default forEachDom;
