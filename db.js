let mysql = require('mysql');
let dbConfig = require('./db.config');
const connection = mysql.createConnection(dbConfig);

connection.connect((err)=>{
  if (err) {
    console.log('数据库链接失败');
    throw err;
  }
});

module.exports = {
  get: function (sql, parasm, callback) {
      //开始数据操作
      // "select * from mono"
      connection.query(sql, parasm, function (err, results, fields) {
        if (err) {
          console.log('数据操作失败');
          throw err;
        }
        //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
        callback && callback(JSON.parse(JSON.stringify(results)), JSON.parse(JSON.stringify(fields)));
      });
  },
  post: function (sql, parasm, callback) {
    // "insert into mono (id,name,age) value (3,"中国",5000)" //我们往数据表mono里面添加了一条数据；   id=3;name=中国;age=5000这是新的一条数据
    // "updata mono set name='中国' shere name='北京'" //我们把mono表里面name数据等于中国，改为了北京
    // "delete from mono id=3" //我们删除mono表里面id=3的数据  delete删除
    // let keys = '', values = ''
    // for (let i in params) {
    //   keys += i + ','
    //   values += params[i] + ','
    // }
    // keys = keys.substr(0, keys.length - 1)
    // values = values.substr(0, values.length - 1)
    // var insert = `insert into ${sql} (${keys}) value (${values})`;  //我们往数据表mono里面添加了一条数据；   id=3;name=中国;age=5000这是新的一条数据
    //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
    connection.query(sql, parasm, function (err, results, fields) {
      if (err) {
        console.log('数据操作失败');
        throw err;
      }
      //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
      callback && callback(results, fields);
    });
  }
};