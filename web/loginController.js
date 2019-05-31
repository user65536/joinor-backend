var express = require('express');
var sessionService = require('../service/sessionService')

var router = express.Router();





router.post('/login', (req, res) => {
  const {code} = req.body;
  const session = req.cookies.s;
  console.log(req.cookies)
  sessionService.checkSession({session, code}).then( ({exist, session=''}) => {
    if(exist) {
      res.json({
        code: 101
      })
    } else {
      res.setHeader('Set-Cookie', `s=${session};`)
      res.json({
        code: 100
      })
    }
  }).catch(() => {
    res.json({
      code: 102
    })
  })
})

module.exports = router;