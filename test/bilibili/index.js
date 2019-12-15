// const https = require('https');
const axios = require('axios');

// 个人信息
// https://api.bilibili.com/x/space/acc/info?mid=32804063&jsonp=jsonp

// 用户查询
// https://api.bilibili.com/x/web-interface/search/type?
// context=&search_type=bili_user&page=1&order=&keyword=豆腐和白菜&category_id=&user_type=&order_sort=&changing=mid&__refresh__=true&highlight=1&single_column=0&jsonp=jsonp&callback=__jp1

// 拿收藏夹列表
// https://api.bilibili.com/medialist/gateway/base/created?pn=1&ps=100&up_mid=32804063&is_space=0&jsonp=jsonp

// 拿收藏夹内容
// https://api.bilibili.com/medialist/gateway/base/spaceDetail?media_id=55504663&pn=1&ps=20&keyword=&order=mtime&type=0&tid=0&jsonp=jsonp
axios
  .get('https://api.bilibili.com/medialist/gateway/base/spaceDetail', {
    params: {
      pn: 1,
      ps: 20,
      keyword: '',
      order: 'mtime',
      type: 0,
      tid: 0,
      jsonp: 'jsonp',
      media_id: '55504663'
    }
  })
  .then(res => {
    // res.on('data', (d) => {
    //   process.stdout.write(d);
    // });
    console.log(res.data);
  });
