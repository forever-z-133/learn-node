const Bomb = require('bomb/src/lib/app');

Bmob.initialize('10bac9596ba1f2d5', 'mememe');

const article = Bmob.Query("article");
getListData();

function getListData() {
  article.find().then(res => {
    console.log(res);
  }).catch();
}