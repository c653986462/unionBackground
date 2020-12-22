let mysql = require('mysql');
let dbConfig = require('./db.config');
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.log('数据库链接失败');
    throw err;
  }
});

module.exports = {
  get: function (sql, params, accpt, callback) {
    //开始数据操作
    let keys = "", values = []
    for (let i in params) {
      if (accpt.indexOf(i) > -1) {
        keys += i + '=?,'
        values.push(params[i])
      }
    }
    keys = keys.substr(0, keys.length - 1)
    let sqlinsate = `SELECT * FROM ${sql}`
    if (accpt.length) {
      sqlinsate += ` where ${keys}`
    }
    console.log(sqlinsate)
    connection.query(sqlinsate, values, function (err, results, fields) {
      if (err) {
        console.log('数据操作失败');
        callback && callback(err);
        return
      }
      //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
      callback && callback(JSON.parse(JSON.stringify(results)), JSON.parse(JSON.stringify(fields)));
    });
  },
  post: function (sql, params, accpt, callback) {
    let keys = "", valueinsate = "", values = []
    for (let i in params) {
      if (accpt.indexOf(i) > -1) {
        keys += i + ','
        valueinsate += '?,'
        values.push(params[i])
      }
    }
    keys = keys.substr(0, keys.length - 1)
    valueinsate = valueinsate.substr(0, valueinsate.length - 1)
    let sqlinsate = `insert into ${sql} (${keys}) value (${valueinsate})`
    // "insert into mono (id,name,age) value (3,"中国",5000)" //我们往数据表mono里面添加了一条数据；   id=3;name=中国;age=5000这是新的一条数据
    // "updata mono set name='中国' shere name='北京'" //我们把mono表里面name数据等于中国，改为了北京
    // "delete from mono id=3" //我们删除mono表里面id=3的数据  delete删除
    connection.query(sqlinsate, values, function (err, results, fields) {
      if (err) {
        console.log(err);
        callback && callback(err);
        return
      }
      callback && callback(results, fields);
    });
  },
  put: function (sql, params, accpt, keyvalue, callback) {
    let keys = "", valueinsate = "", values = []
    for (let i in params) {
      if (accpt.indexOf(i) > -1) {
        keys += i + '=?,'
        valueinsate += '?,'
        values.push(params[i])
      }
    }
    values.push(keyvalue)
    keys = keys.substr(0, keys.length - 1)
    valueinsate = valueinsate.substr(0, valueinsate.length - 1)
    let sqlinsate = `update ${sql} set ${keys} where id=?`
    connection.query(sqlinsate, values, function (err, results, fields) {
      if (err) {
        console.log(err);
        callback && callback(err);
        return
      }
      callback && callback(results, fields);
    });
  },
  delete: function (sql, id, callback) {
    let sqlinsate = `delete from ${sql} where id=?`
    let values = []
    values.push(id)
    connection.query(sqlinsate, values, function (err, results, fields) {
      if (err) {
        console.log(err);
        callback && callback(err, 1);
        return
      }
      callback && callback(results, fields);
    });
  }
};