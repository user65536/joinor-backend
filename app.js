var express = require("express")
var cookieParser = require('cookie-parser');


var app = express()

var activityRouter = require('./web/activityController')
var loginRouter = require('./web/loginController')


app.use(cookieParser())
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


app.use(activityRouter)
app.use(loginRouter)


app.get('*', (req, res) => {
  res.status(404).end('404')
})

module.exports = app;