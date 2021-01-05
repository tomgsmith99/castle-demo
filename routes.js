
var fs = require('fs')

var request = require('request')

// var session = require("express-session");

//*******************************************/

module.exports = function (app) {


	app.get('/favicon.ico', function(req, res, next) {

		res.sendStatus(200)
	})

	app.get('/', function(req, res, next) {

		var view = {
			castle_app_id: process.env.castle_app_id,
		}

		view.home = true

		res.render('index', view)
	})

	app.get('/:demo_name', function(req, res, next) {

		var demo_allowlist = [
			"error",
			"register"
		]

		var demo_name = req.params.demo_name

		var view = {
			castle_app_id: process.env.castle_app_id,
		}

		if (!(demo_allowlist.includes(demo_name))) {
			view.error = true
		}
		else {
			view[demo_name] = true
		}

		res.render('index', view)

	})

	//*******************************************/

	app.post('/evaluate_reg_form', function(req, res) {

		console.log("received a submission.")
		console.log("the ip address is: " + req.ip)
		console.log(req.connection.remoteAddress)

		console.dir(req.body)

		client_id = req.body.clientId

		email = req.body.email

		payload = {
			"event": "$registration.attempted",
			"user_traits": {
				"email": email
			},
			"context": {
				"client_id": client_id,
				"ip": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
				"User-Agent": req.get('User-Agent')
			}
		}

		var authz_string = "Basic " + Buffer.from(":" + process.env.castle_api_secret).toString('base64')

		var options = {
			'method': 'POST',
			'url': 'https://api.castle.io/v1/authenticate',
			'headers': {
				'Content-Type': 'application/json',
				'Authorization': authz_string
			},
			body: JSON.stringify(payload)
		}

		request(options, function (error, response) {
			if (error) throw new Error(error)
			console.log(response.body)

			var r = {}

			r.payload = payload
			r.result = JSON.parse(response.body)

			res.json(r)

		})

	})
}