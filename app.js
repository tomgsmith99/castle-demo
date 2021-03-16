
require('dotenv').config()

const mustacheExpress = require('mustache-express');

const express = require('express')

///////////////////////////////////////////////////

const app = express()

app.use(express.static('public'))

app.use(express.json())

app.use(express.urlencoded({extended: true}));

app.engine('html', mustacheExpress());

app.set('view engine', 'html')

// app.use(session({ secret: SESSION_SECRET, cookie: { maxAge: SESSION_MAX_AGE }}));

require('./routes.js')(app)

const port = process.env.PORT || 3099

app.listen(port, function () {
	console.log('App listening on port ' + port)
})
