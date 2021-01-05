// Castle.io demos

var mustache_express = require('mustache-express')

////////////////////////////////////////////////////
require('dotenv').config()

const express = require('express')

// var session = require("express-session");

///////////////////////////////////////////////////

// SET UP WEB SERVER

const app = express()

app.use(express.static('public'))

app.use(express.json())

app.engine('html', mustache_express())

app.set('view engine', 'html')

app.set('views', __dirname + '/views')

// app.use(session({ secret: SESSION_SECRET, cookie: { maxAge: SESSION_MAX_AGE }}));

require('./routes.js')(app)

var port = process.env.PORT || 3099

app.listen(port, function () {
	console.log('App listening on port ' + port)
})
