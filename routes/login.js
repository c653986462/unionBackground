var express = require('express');
var router = express.Router();
var db = require("../db"); //引入数据库封装模块

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


/* GET home page. */
router.get('/mobilelogin', function (req, res, next) {

  if (!req.query.account || !req.query.keywords) {
    res.send({
      code: 3,
      msg: '请输入账号密码'
    });
    return
  }
  db.get("users", req.query, ['account'], function (results, fields) {
    if (fields === 1) {
      res.send({
        code: 10001,
        msg: results
      });
      return
    }
    if (results.length) {
      for (let i = 0; i < results.length; i++) {
        if (results[i].keywords == req.query.keywords) {
          res.send({
            code: 0,
            msg: '成功',
            data: {
              status: results[i].status,
              id: results[i].id,
              account: results[i].account,
            }
          });
          return
        }
      }
      res.send({
        code: 1,
        msg: '密码错误'
      });
    } else {
      res.send({
        code: 2,
        msg: '无该账号信息'
      });
    }
  })

});

module.exports = router;
