var express = require('express');
var router = express.Router();
var path = require('path'); //系统路径模块
var fs = require('fs'); //文件模块


var file = path.join(__dirname, '../public/json/test.json'); //文件路径，__dirname为当前运行js文件的目录
var bodyParser = require('body-parser');/*post方法*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
