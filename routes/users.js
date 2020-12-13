var express = require('express');
var router = express.Router();
var db = require("../db"); //引入数据库封装模块

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


/* GET home page. */
router.get('/getUsers', function (req, res, next) {

  //查询users表
  db.get("SELECT * FROM USERS", [], function (results, fields) {
    console.log(results);

    res.send({
      code: 0,
      msg: '',
      data: results
    });
  })

});

/**
 * author: cmy
 * params: {
 *  
 *  
 * }
 * **/
router.post('/addUsers', function (req, res, next) {
  const params = req.body
  console.log(req.body)
  let keys = ""
  for (let i in params) {
    keys += i + ','
  }
  keys = keys.substr(0, keys.length - 1)
  console.log(keys)
  let sql = `insert into USERS (${keys}) value (?, ?, ?)`
  //查询users表
  db.post(sql, [params.account, params.keywords, params.status], function (results, fields) {
    console.log(results);

    res.send({
      code: 0,
      msg: '',
      data: results
    });
  })

});

module.exports = router;
