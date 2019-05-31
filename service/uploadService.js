var fs = require("fs")
var activityDao = require("../dao/activityDao")

var {host} = require('../config/general')

function moveFile(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, function (err) {
      if(err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function save({params, imgPath, imgType}) {
  const imgName = imgPath.split('/').slice(-1)[0];
  const imgFullName = `${imgName}.${imgType}`;
  for(let [k, v] of Object.entries(params)) {
    if(v === '') {
      return Promise.reject(`property ${k} has empty value`)
    }
  }
  return moveFile(imgPath, `${imgPath}.${imgType}`).then(() => {
    params.poster = `${host}${imgFullName}`
    return activityDao.insertProjectInfo(params)
  }).then(() => {
    return Promise.resolve(imgFullName)
  }).catch((err) => {
    return Promise.reject(err)
  })
}

module.exports = {
  save
}