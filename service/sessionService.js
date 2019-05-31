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

function checkSession({session, code}) {
  if(session) {
    return sessionDao.getOpenidBySession(session).then(openid => {
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

module.exports = {
  checkSession,
  genSessionAndWrite
}