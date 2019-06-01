const activityDao = require("../dao/activityDao")
const userActivityDao = require("../dao/userActivityDao")

const sessionService = require("./sessionService")





function getActionList({count, offset}) {
  return activityDao.getActivityList({count, offset})
}

function getActionDetail({actionID, session}) {
  let resultDetail = {};
  let state = -1;
  return activityDao.getDetailById(actionID).then(detail => {
    if(detail) {
      resultDetail = detail
      return sessionService.checkUserBySession(session)
    } else {
      return Promise.reject(203)
    }
  }).then((({id, openid})=> {
    if(id && openid) {
      //查找用户已报名活动里是否存在此活动,确定state值
      return userActivityDao.getEnrolledActivityByUserId(id).then(activityList => {
        for(let activity of activityList) {
          if(activity.activity_id == actionID) {
            state = activity.state
            resultDetail.code = activity.code
            return Promise.resolve({
              detail: resultDetail,
              state: state
            })
          }
        }
        return Promise.resolve({
          detail: resultDetail,
          state: -3
        })
      }).catch(() => {
        return Promise.reject(201)
      })
    } else {
      return Promise.resolve({
        code: 202,
        detail: resultDetail,
        state: ''
      })
    }
  }))
}

function signUp({session, actionID}) {
  let userID = null;
  return sessionService.checkUserBySession(session).then(({id, openid}) => {
    if(openid && id) {
      userID = id
      return  userActivityDao.getEnrolledActivityByUserId(id)
    } else {
      return Promise.reject(202)
    }
  }).then(activityList => {
    for(activity of activityList) {
      if(activity.activity_id == actionID) { // 已报名
        return Promise.reject(401)
      }
    }
    return activityDao.getActivityNumberById(actionID)
  }).then(number => {
    if(number) {
      let {currentNumber, totalNumber} = number;
      if(currentNumber >= totalNumber) {
        return Promise.reject(402)
      } else {
        return writeSignUp({actionID, userID})
      }
    } else {
      return Promise.reject(404)
    }
  }).catch(err => {
    if(typeof err === 'number') {
      return Promise.reject(err)
    } else {
      return Promise.reject(403)
    }
  })
}

function writeSignUp({actionID, userID}) {
  const code = Math.random().toString().slice(-8)
  return userActivityDao.setSignUp({actionID, userID, code }).then(() => {
    console.log(`id为 ${userID} 的用户已报名活动 ${actionID}`)
    return Promise.resolve()
  }).catch((err) => {
    return Promise.reject(403)
  })
}

function getEnrolledAction(session) {
  return sessionService.checkUserBySession(session).then( ({id, openid}) => {
    if(id && openid) {
      return userActivityDao.getEnrolledActivityDetailByUserId(id).then((list) => {
        return Promise.resolve(list)
      }).catch(() => {
        return Promise.reject(201)
      })
    } else {
      return Promise.reject(202)
    }
  })
}



module.exports = {
  getActionList,
  getActionDetail,
  signUp,
  getEnrolledAction
}