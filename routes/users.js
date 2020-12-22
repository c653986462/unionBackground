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
  const accpt = ['account', 'keywords', 'status']
  //查询users表
  db.post('USERS', req.body, accpt, function (results, fields) {
    res.send({
      code: 0,
      msg: '成功',
      data: ''
    });
  })

});

router.put('/updateUsers/:id', function (req, res, next) {
  const accpt = ['account', 'keywords', 'status']
  //查询users表
  db.put('users', req.body, accpt, Number(req.params.id), function () {
    res.send({
      code: 0,
      msg: '成功',
      data: ''
    });
  })

});

router.delete('/deleteUsers/:id', function (req, res, next) {
  //查询users表
  db.delete('users', Number(req.params.id), function () {
    res.send({
      code: 0,
      msg: '成功',
      data: ''
    });
  })

});

module.exports = router;
