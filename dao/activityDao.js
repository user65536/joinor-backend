var dbutil = require('./dbutil');
var db = dbutil.connect;

function getReleasedAction() {
  let sql = 'select id, title, subtitle, start_time, location, organizer from activity;'
  return db(sql)
}

function insertProjectInfo(data) {
  let {title, subtitle, start_time, location, totalNumber, organizer, intro, poster} = data;
  let sql = 'insert into activity (title, subtitle, start_time, location, totalNumber, organizer, intro, poster)  values(?,?,?,?,?,?,?,?);'
  return db(sql, [title, subtitle, start_time, location, totalNumber, organizer, intro, poster])
}

function getActivityList({count, offset}) {
  let sql = 'select id, poster, title, subtitle, location, start_time, organizer from activity limit ?,?;'
  return db(sql, [+offset, +count]).then(res => {
    return Promise.resolve(res)
  }).catch(err => {
    return Promise.reject(err)
  })
}


module.exports = {
  getReleasedAction,
  insertProjectInfo,
  getActivityList
}