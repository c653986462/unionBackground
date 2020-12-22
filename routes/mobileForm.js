var utilsCommon = require('../utils/common')
var express = require('express');
var router = express.Router();
var db = require("../db"); //引入数据库封装模块

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/getStatus', function (req, res, next) {
  const checkObj = {
    status: '账号身份缺失',
    account: '无账号信息'
  }
  console.log(req.query)
  const checkRlt = utilsCommon.checkparams(req.query, checkObj, (status, resp) => {
    console.log(status)
    if (!status) {
      res.send({
        code: 0,
        msg: resp,
        data: ''
      });
      return false
    } else {
      return true
    }
  })
  if (!checkRlt) return
  const date = new Date()
  if (date.getDay() > 5) {
    res.send({
      code: 0,
      msg: '',
      data: {
        status: 0
      }
    });
    return
  }
  let sql
  if (req.query.status + '' === '1') sql = 'ghgb'
  else if (req.query.status + '' === '2') sql = 'zgdb'
  else if (req.query.status + '' === '3') sql = 'zgdb'
  else if (req.query.status + '' === '4') sql = 'zgdb'
  //查询users表
  db.get(sql, req.query, ['account'], function (results, fields) {
    console.log(results)
    if (!results.length) {
      res.send({
        code: 0,
        msg: '',
        data: {
          status: 1,
          saveData: null
        }
      });
      return
    }
    for (let i = 0; i < results.length; i++) {
      if (utilsCommon.checkTime(results[i].time)) {
        if (results[i].submited + '' === '1') {
          res.send({
            code: 0,
            msg: '',
            data: {
              status: 0,
              saveData: results[i].saveData
            }
          });
          return
        } else {
          res.send({
            code: 0,
            msg: '',
            data: {
              status: 1,
              saveData: results[i].saveData
            }
          });
          return
        }
      }
    }
    res.send({
      code: 0,
      msg: '',
      data: {
        status: 1,
        saveData: null
      }
    });
  })

});

/* GET home page. */
router.post('/submit', function (req, res, next) {
  console.log(req.body)
  //查询users表
  db.post("SELECT * FROM USERS", [], function (results, fields) {
    res.send({
      code: 0,
      msg: '',
      data: results
    });
  })

});

module.exports = router;
