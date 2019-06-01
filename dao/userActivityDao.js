const dbutil = require("./dbutil")
const db = dbutil.connect

function getEnrolledActivityByUserId(userid) {
  const sql = `select activity_id, state, code from user_activity_map where user_id = ?;`
  return db(sql, [userid]).then(result => {
    return Promise.resolve(result)
  }).catch((err) => {
    return Promise.reject()
  })
}

function getEnrolledActivityDetailByUserId(userid) {
  const sql = `select id, title, start_time, poster, location from activity where id in (select activity_id from user_activity_map where user_id = ?);`
  return db(sql, [userid]).then(result => {
    return Promise.resolve(result)
  }).catch((err) => {
    return Promise.reject()
  })
}

function setSignUp({actionID, userID, code}) {
  const insertSql = `insert into user_activity_map (user_id, activity_id, state, code) values(?, ?, ?, ?);`
  const updateSql = `update activity set currentNumber = currentNumber + 1 where id = ?;  `
  return Promise.all([
    db(insertSql, [userID, actionID, '1', code]),
    db(updateSql, [actionID])
  ])
}

module.exports = {
  getEnrolledActivityByUserId,
  setSignUp,
  getEnrolledActivityDetailByUserId
}