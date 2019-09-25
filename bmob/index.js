const Bmob = require('./Bmob-2.2.0.min.js');

Bmob.initialize('10bac9596ba1f2d5', 'mememe');

const article = Bmob.Query("article");

(async function() {
  var res = await article.find();
  console.log(res);
})();