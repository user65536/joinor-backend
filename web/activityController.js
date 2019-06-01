var express = require('express');
const formidableMiddleware = require('express-formidable');
const generalConfig = require('../config/general')

var uploadService = require("../service/uploadService")
var activityService = require("../service/activityService")


var router = express.Router();



router.get('/getReleasedAction', (req, res) => {
  // activityDao.getReleasedAction().then(data => {
  //   console.log(data);
  //   res.json({
  //     code: 200,
  //     list: data
  //   })
  // }).catch(err => {
  //   console.log(err)
  // })
})

router.get('/getEnrolledAction', (req, res) => {
  const session = req.cookies.s;
  activityService.getEnrolledAction(session).then(list => {
    res.json({
      code: 200,
      list
    })
  }).catch(code => {
    res.json({
      code
    })
  })
})

router.get('/getActionDetail', (req, res) => {
  const actionID = req.query.id;
  const session = req.cookies.s;
  activityService.getActionDetail({actionID, session}).then( ({detail, state, code}) => {
    res.json({
      code,
      detail,
      state
    })
  }).catch(errCode => {
    res.json({
      code: errCode
    })
  })
})

router.get('/getActionList', (req, res) => {
  let {count = '10', offset = '0'} = req.query
  activityService.getActionList({count, offset}).then(list => {
    res.json({
      code: 200,
      list
    })
  }).catch((err) => {
    res.json({
      code: 201
    })
  })
})

router.get('/getBannerList', (req, res) => {
  
})

router.post('/release', formidableMiddleware({
  encoding: 'utf-8',
  uploadDir: generalConfig.imgDir
}), 
 (req, res) => {
  const params = req.fields;
  const imgPath = req.files.file.path
  const imgType = req.files.file.name.split('.').slice(-1)[0]
  uploadService.save({params, imgPath, imgType}).then((path) => {
    res.json({
      code: 300
    })
  }).catch((err) => {
    res.json({
      code: 301
    })
  })
})

module.exports =  router;