const activityDao = require("../dao/activityDao")





function getActionList({count, offset}) {
  return activityDao.getActivityList({count, offset})
}

module.exports = {
  getActionList
}