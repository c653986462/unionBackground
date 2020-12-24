var utilsCommon = require('../utils/common')
var express = require('express');
var router = express.Router();
var db = require("../db"); //引入数据库封装模块

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
/**
 * 获取用户可提交状态
 * **/
router.get('/getStatus', function (req, res, next) {
  const checkObj = {
    status: '账号身份缺失',
    account: '无账号信息'
  }
  const checkRlt = utilsCommon.checkparams(req.query, checkObj, (status, resp) => {
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
      msg: '可提交时间为周一至周五',
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
        if (results[i].submited) {
          res.send({
            code: 0,
            msg: '本周已提交，不能再次提交',
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
  }, err => {
    next(err)
  })

});

/**
 * 保存用户提交信息
 * **/
router.post('/save', function (req, res, next) {
  const checkObj = {
    status: '账号身份缺失',
    account: '无账号信息'
  }
  const checkRlt = utilsCommon.checkparams(req.body, checkObj, (status, resp) => {
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
      code: 1,
      msg: '可提交时间为周一至周五',
      data: ''
    });
    return
  }
  let sql
  if (req.body.status + '' === '1') sql = 'ghgb'
  else if (req.body.status + '' === '2') sql = 'zgdb'
  else if (req.body.status + '' === '3') sql = 'shry'
  else if (req.body.status + '' === '4') sql = 'ckjd'
  //查询users表
  db.get(sql, req.body, ['account'], function (results, fields) {
    let savedata = { ...req.body }
    savedata.time = utilsCommon.getToday()
    if (!results.length) {
      db.post(sql, savedata, ['account', 'saveData', 'time'], function (results, fields) {
        res.send({
          code: 0,
          msg: '保存成功',
          data: ''
        });
      }, err => {
        next(err)
      })
      return
    }
    for (let i = 0; i < results.length; i++) {
      if (utilsCommon.checkTime(results[i].time)) {
        if (results[i].submited) {
          res.send({
            code: 1,
            msg: '本周已提交，不能保存',
            data: ''
          });
          return
        } else {
          db.put(sql, savedata, ['account', 'saveData', 'time'], Number(results[i].id), function () {
            res.send({
              code: 0,
              msg: '保存成功',
              data: ''
            });
          }, err => {
            next(err)
          })
          return
        }
      }
    }
    db.post(sql, savedata, ['account', 'saveData', 'time'], function (results, fields) {
      res.send({
        code: 0,
        msg: '保存成功',
        data: ''
      });
    }, err => {
      next(err)
    })
  }, err => {
    next(err)
  })

});

/**
 * 提交用户提交信息
 * **/
router.post('/submit', function (req, res, next) {
  const checkObj = {
    status: '账号身份缺失',
    account: '无账号信息'
  }
  const checkRlt = utilsCommon.checkparams(req.body, checkObj, (status, resp) => {
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
      code: 1,
      msg: '可提交时间为周一至周五',
      data: ''
    });
    return
  }
  let sql, accept, savedata = { time: utilsCommon.getToday(), submited: 1, account: req.body.account }
  if (req.body.status + '' === '1') {
    sql = 'ghgb'
    accept = ['ldjf', 'ldjfcount', 'ldjfdd', 'ldjfms', 'jtzy', 'jtzycount', 'jtzydd', 'jtzyms', 'aqsg', 'aqsgcount', 'aqsgdd', 'aqsgms', 'tfsj', 'tfsjcount', 'tfsjdd', 'tfsjms', 'cyldjf', 'cyldjfcount', 'other', 'img', 'saveData', 'time', 'account', 'submited']
    savedata = { ...savedata, ...req.body.submitData.ghgb }
  }
  else if (req.body.status + '' === '2') {
    sql = 'zgdb'
    accept = ['jbjd', 'jbjdcount', 'jbjdzy', 'jbjdsj', 'gssg', 'gssgcount', 'lzjf', 'lzjfcount', 'yglz', 'yglzcount', 'sfmy', 'bmyyy', 'other', 'img', 'saveData', 'time', 'account', 'submited']
    savedata = { ...savedata, ...req.body.submitData.zgdb }
  }
  else if (req.body.status + '' === '3') {
    sql = 'shry'
    accept = ['ldjf', 'ldjfcount', 'ldjfdd', 'ldjfms', 'qtxjf', 'qtxjfcount', 'qtxjfdd', 'qtxjfms', 'jscl', 'wthtjf', 'wtldbc', 'wtshbx', 'wtgzsj', 'wtjtzy', 'wtother', 'advice', 'other', 'img', 'saveData', 'time', 'account', 'submited']
    savedata = { ...savedata, ...req.body.submitData.shry }
  }
  else if (req.body.status + '' === '4') {
    sql = 'ckjd'
    accept = ['gsdyzx', 'gsdytj', 'gsdyyz', 'gsdysj', 'gsdycount', 'htjfzx', 'htjftj', 'htjfyz', 'htjfsj', 'htjfcount', 'ldbczx', 'ldbctj', 'ldbcyz', 'ldbcsj', 'ldbccount', 'shbxzx', 'shbxtj', 'shbxyz', 'shbxsj', 'shbxcount', 'gzsjzx', 'gzsjtj', 'gzsjyz', 'gzsjsj', 'gzsjcount', 'jtzyzx', 'jtzytj', 'jtzyyz', 'jtzysj', 'jtzycount', 'fldyzx', 'fldytj', 'fldyyz', 'fldysj', 'fldycount', 'flyzsl', 'flyzja', 'totalcount', 'saveData', 'time', 'account', 'submited']
    savedata = { ...savedata, ...req.body.submitData.ckjd }
  }
  //查询users表
  db.get(sql, req.body, ['account'], function (results, fields) {
    if (!results.length) {
      db.post(sql, savedata, accept, function (results, fields) {
        res.send({
          code: 0,
          msg: '提交成功',
          data: ''
        });
      }, err => {
        next(err)
      })
      return
    }
    for (let i = 0; i < results.length; i++) {
      if (utilsCommon.checkTime(results[i].time)) {
        if (results[i].submited) {
          res.send({
            code: 1,
            msg: '本周已提交，不能再次提交',
            data: ''
          });
          return
        } else {
          db.put(sql, savedata, accept, Number(results[i].id), function () {
            res.send({
              code: 0,
              msg: '提交成功',
              data: ''
            });
          }, err => {
            next(err)
          })
          return
        }
      }
    }
    db.post(sql, savedata, accept, function (results, fields) {
      res.send({
        code: 0,
        msg: '提交成功',
        data: ''
      });
    }, err => {
      next(err)
    })
  }, err => {
    next(err)
  })

});

module.exports = router;

