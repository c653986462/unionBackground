var express = require('express');
var router = express.Router();
var db = require("../db"); //引入数据库封装模块

const bodyParser = require('body-parser')
var multiparty = require('multiparty')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))
// 获取本机电脑IP
function getIPAdress() {
  let interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        // console.log(alias.address);

        return alias.address
      }
    }
  }
}
const ip = getIPAdress()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/**
 * 获取杭州市地址
 * **/
router.get('/getposition', function (req, res, next) {

  db.get("position", [], [], function (results, fields) {
    if (fields === 1) {
      res.send({
        code: 10001,
        msg: results
      });
      return
    }
    res.send({
      code: 0,
      msg: '',
      data: results
    });

  })

});


/**
 * 上传接收图片
 * **/

router.post('/upload', function (req, res, next) {
  try {
    let form = new multiparty.Form({ uploadDir: './public/images' })
    form.parse(req, function (err, fields, file) {
      res.send({
        code: 0,
        msg: '',
        data: 'http:\/\/' + ip + ':3000/' + file.data[0].path.replace(/\\/, '/')
      });
    })
  } catch (err) {
    res.send({
      code: 500,
      msg: '',
      data: err
    });
  }
});

module.exports = router;
