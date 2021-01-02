const axios = require('axios');

/// server 酱，通过 http://sc.ftqq.com/ 登录获取，向指定微信服务号发送通知
const SCKEY = 'SCU143623T8c7605452b1d2b11831ef7acb6fc68ec5ff0193417816';

/// PUSH+，通过 https://pushplus.hxtrip.com/message 登录获取，向指定微信服务号发送通知
const PushPlus_SCKEY = 'befa1e8793d8405ead0672d3549b98f9';

/// 酷推，通过 https://cp.xuthus.cc/ 登录获取，向指定扣扣(3150058140)发送通知
const CollPush_SCKEY = '71517cd3145b7548346284306c1ee12d';

/// 开始通知
(async () => {
  // await sendNotify_WeChat('我是标题', '我是简介');
  // await sendNotify_WeChat_2('我是标题', '我是简介');
  // await sendNotify_QQ('我是酷推');
})();

/// 使用 server 酱发送微信通知
async function sendNotify_WeChat(title, desc) {
  const params = { text: title, desp: desc };
  return ajax(`https://sc.ftqq.com/${SCKEY}.send`, 'get', params).then((res) => {
    const data = res.data;
    if (data.errno === 0) {
      console.log('server 酱发送通知消息成功\n');
    } else if (data.errno === 1024) { // 一分钟内发送相同的内容会触发
      console.log(`server 酱发送通知消息异常: ${data.errmsg}\n`);
    } else {
      console.log(`server 酱发送通知消息异常\n${JSON.stringify(data)}`);
    }
  }).catch((err) => {
    console.log(`server 酱发送通知消息异常\n${JSON.stringify(err)}`);
  });
}

/// 使用 push+ 发送微信通知
async function sendNotify_WeChat_2(title, desc) {
  const params = { token: PushPlus_SCKEY, title: title, content: desc };
  return ajax(`http://pushplus.hxtrip.com/send`, 'get', params).then((res) => {
    const data = res.data;
    if (data.code === 200) {
      console.log('push+ 发送通知消息成功\n');
    } else {
      console.log(`push+ 发送通知消息异常\n${JSON.stringify(data)}`);
    }
  }).catch((err) => {
    console.log(`push+ 发送通知消息异常\n${JSON.stringify(err)}`);
  });
}

/// 使用酷推发送扣扣通知
async function sendNotify_QQ(text) {
  const params = { c: text };
  return ajax(`https://push.xuthus.cc/send/${CollPush_SCKEY}`, 'get', params).then((res) => {
    const data = res.data;
    if (data.msg === 'ok') {
      console.log('酷推发送通知消息成功\n');
    } else {
      console.log(`酷推发送通知消息异常\n${JSON.stringify(data)}`);
    }
  }).catch((err) => {
    console.log(`酷推发送通知消息异常\n${JSON.stringify(err)}`);
  });
}

async function ajax(url, method, data, options = {}) {
  if (/^get$/i.test(method)) {
    return axios.get(url, { params: data }, { ...options });
  } else if (/^post$/i.test(method)) {
    return axios.post(url, data, { ...options });
  } else if (/^form-?data$/i.test(method)) {
    const fd = new FormData();
    for (let key in data) fd.append(key, data[key]);
    return axios.post(url, fd, { ...options, 'Content-Type': 'multipart/form-data' });
  }
  return axios({ url, method, ...options });
}
