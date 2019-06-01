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

function getDetailById(userid) {
  const sql = `select id, totalNumber, currentNumber, poster, title, subtitle, location, start_time, organizer, intro from activity where id = ?;`
  return db(sql, [userid]).then(result => {
    if(result.length) {
      return Promise.resolve(result[0])
    } else {
      return Promise.resolve(null)
    }
  }).catch(err => {
    return Promise.reject()
  })
}

function getActivityNumberById(actionID) {
  const sql = `select currentNumber, totalNumber from activity where id = ?;`
  return db(sql, [actionID]).then(result => {
    if(result.length) {
      return Promise.resolve(result[0])
    } else {
      return Promise.resolve(null)
    }
  })
}


module.exports = {
  getReleasedAction,
  insertProjectInfo,
  getActivityList,
  getDetailById,
  getActivityNumberById
}