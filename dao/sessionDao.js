const dbutil = require('./dbutil');
const db = dbutil.connect;



function writeSession({session, openid}) {
  const insertSession = `insert into session_user_map (user_id, session_id) values(?,?);`
  const selectOpenid = 'select * from user where openid = ?;'
  const insertOpenid = `insert into user (openid) values (?);`
  return db(selectOpenid, [openid]).then(result => {
    if(result.length) {
      return db(insertSession, [result[0].id, session])
    } else {
      return db(insertOpenid, [openid]).then( ({insertId}) => {
        return db(insertSession, [insertId, session])
      }) 
    }
  }).then(() => {
    return Promise.resolve(session)
  }).catch(() => {
    return Promise.reject()
  })
}

function getOpenidBySession(session) {
  const sql = `select openid from user where id in (select user_id from session_user_map where session_id = ?);  `
  return db(sql, [session]).then((result) => {
    if(result.length) {
      return Promise.resolve(result[0].openid)
    } else {
      return Promise.resolve(null)
    }
  }).catch(() => {
    return Promise.reject()
  })
}

module.exports = {
  writeSession,
  getOpenidBySession
}