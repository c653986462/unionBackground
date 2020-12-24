var utilsCommon = require('../utils/common')
var express = require('express');
var router = express.Router();
var db = require("../db"); //引入数据库封装模块

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/**
 * 获取突发事件列表
 * **/
router.get('/getList', function (req, res, next) {
  const checkObj = {
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

  //查询users表
  db.get('accident', req.query, ['account'], function (results, fields) {
    res.send({
      code: 0,
      msg: '',
      data: results
    });
    return
  }, err => {
    next(err)
  })

});

/**
 * 获取突发事件详情
 * **/
router.get('/getDetial', function (req, res, next) {
  const checkObj = {
    id: '缺少查询条件'
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

  //查询users表
  db.get('accident', req.query, ['id'], function (results, fields) {
    res.send({
      code: 0,
      msg: '',
      data: results
    });
    return
  }, err => {
    next(err)
  })

});

/**
 * 保存突发事件列表
 * **/
router.post('/save', function (req, res, next) {
  const checkObj = {
    happenTime: '无发生时间',
    account: '无账号信息',
    position: '无地点',
    contant: '无内容'
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

  //查询users表
  let savedata = { ...req.body }
  savedata.saveTime = utilsCommon.getToday()

  db.post('accident', savedata, ['account', 'happenTime', 'position', 'contant', 'img', 'saveTime'], function (results, fields) {
    res.send({
      code: 0,
      msg: '保存成功',
      data: ''
    });
  }, err => {
    next(err)
  })

});

module.exports = router;

