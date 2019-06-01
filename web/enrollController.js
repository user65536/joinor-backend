var express = require('express');

var activityService = require("../service/activityService")

var router = express.Router();

router.post('/checkEnroll', (req, res) => {

})

router.post('/signUp', (req, res) => {
  const session = req.cookies.s;
  const actionID = req.body.id
  activityService.signUp({actionID, session}).then(() => {
    res.json({
      code: 400
    })
  }).catch(code => {
    res.json({
      code
    })
  })
})


module.exports = router;