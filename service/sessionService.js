let sessionDao = require("../dao/sessionDao")
var axios = require('axios');
let md5 = require("md5")

function sendCodeToWechat(code) {
  const mpCode = require('../config/mpcode')
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${mpCode.appID}&secret=${mpCode.appSecret}&js_code=${code}&grant_type=authorization_code`;
  return axios.get(url)
}

function genSessionAndWrite(code) {
  return sendCodeToWechat(code)
  .then(({data}) => {
    const {openid} = data;
    let session = md5(`${openid}${new Date().getTime()}session`)
    return sessionDao.writeSession({session, openid})
  }).then((session) => {
    return Promise.resolve(session)
  }).catch(error => {
    return Promise.reject(error)
  })
}

//检查session是否在表中,如果不在则生成session并写入
function checkSession({session, code}) {
  if(session) {
    return sessionDao.getOpenidBySession(session).then( ({openid, id}) => {
      if(openid) {
        return Promise.resolve({exist: true, session: ''})
      } else {
        return genSessionAndWrite(code).then(session => {
          return Promise.resolve({exist: false, session})
        }).catch(err => {
          return Promise.reject(err)
        })
      }
    }).catch(() => {
      return Promise.reject('sql down')
    })
  } else {
    return genSessionAndWrite(code).then(session => {
      return Promise.resolve({exist: false, session})
    }).catch(err => {
      return Promise.reject(err)
    })
  }
}

//根据session返回用户id及openid
function checkUserBySession(session) {
  return sessionDao.getOpenidBySession(session)
}

module.exports = {
  checkSession,
  genSessionAndWrite,
  checkUserBySession
}