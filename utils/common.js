module.exports = {
  /**
   * 检查入参是否包含所有所需参数
   * params： 入参
   * obj： {} key: 所需参数  value： 无该参数是报错信息
   * **/
  checkparams: (params, obj, callback) => {
    for (let i in obj) {
      if (!params.hasOwnProperty(i)) {
        return callback && callback(false, obj[i])
      }
    }
    return callback && callback(true)
  },
  /**
   * 检查入参当天是否在本周内
   * time： 入参当天时间
   * **/
  checkTime: (time) => {
    function getDates() {
      var new_Date = new Date()
      var timesStamp = new_Date.getTime();
      var currenDay = new_Date.getDay();
      var dates = [];
      for (var i = 0; i < 7; i++) {
        let date = new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).toLocaleDateString().replace(/[年月]/g, '-').replace(/[日上下午]/g, '')
        let datearr = date.split('-')
        if (Number(datearr[1] < 10)) datearr[1] = '0' + datearr[1]
        if (Number(datearr[2] < 10)) datearr[2] = '0' + datearr[2]
        date = datearr[0] + '-' + datearr[1] + '-' + datearr[2]
        dates.push(date);
      }
      return dates
    }
    const week = getDates()
    if (week.indexOf(time) > -1) {
      return true
    }
    return false
  },
  /**
   * 获取当天日期
   * **/
  getToday: () => {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  }
}