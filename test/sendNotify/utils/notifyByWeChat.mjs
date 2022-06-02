import axios from 'axios';

/// server 酱，通过 http://sc.ftqq.com/ 登录获取，向指定微信服务号发送通知
const SCKEY = 'SCU143623T8c7605452b1d2b11831ef7acb6fc68ec5ff0193417816';

/**
 * 发送企微消息
 * @param {*} title 标题
 * @param {*} desc 内容
 * @returns promise<undefined>
 */
const notifyByWeChat = async (title, content) => {
  const params = { text: title, desp: content };
  return axios.get(`https://sc.ftqq.com/${SCKEY}.send`, { params }).then(res => {
    const data = res.data;
    if (data.errno === 0) {
      console.log('server 酱发送通知消息成功\n');
    } else if (data.errno === 1024) { // 一分钟内发送相同的内容会触发
      console.log(`server 酱发送通知消息异常: ${data.errmsg}\n`);
    } else {
      console.log(`server 酱发送通知消息异常\n${JSON.stringify(data)}`);
    }
  }).catch(err => {
    console.log(`server 酱发送通知消息异常\n${JSON.stringify(err)}`);
  });
};
export default notifyByWeChat;
