
var request = require('request')

//*******************************************/

var demo_allowlist = [
	"authenticate",
	"error",
	"forgot_password",
	"register"
]

//*******************************************/

module.exports = function (app) {

	app.get('/favicon.ico', function(req, res, next) {
		res.sendStatus(200)
	})

	app.get('/', function(req, res, next) {
		var view = get_view()

		view.home = true

		res.render('base', view)
	})

	app.get('/cloudfront', function(req, res, next) {

		var view = get_view()

		view.cloudfront = true
		view.cloudfront_url = process.env.cloudfront_url
		view.example_name = "Castle integration with AWS Cloudfront/Lambda@Edge"
		view.github_url = "https://github.com/castle/castle-aws-cloudfront-sample"

		res.render('base', view)

	})

	app.get('/test', function(req, res, next) {

		var view = {test: "no way"}

		res.render('base', view)

	})

	//*******************************************/

	app.post('/cloudfront', function(req, res) {

		console.dir(req.body)

		var options = {
			'method': 'POST',
			'url': process.env.cloudfront_url + '/register',
			'headers': {
		    	"Content-Type": "application/x-www-form-urlencoded"
			},
			form: req.body
		}

		request(options, function (error, response) {
			if (error) throw new Error(error)
			console.log(response.body)

			res.json(response.body)
		})
	})

	app.post('/evaluate_form_vals', function(req, res) {

		console.log("received a submission.")
		console.log("the ip address is: " + req.ip)
		console.log(req.connection.remoteAddress)

		console.dir(req.body)

		client_id = req.body.clientId

		email = req.body.email

		payload = {
			// "event": "$registration.attempted",
			"user_traits": {
				"email": email
			},
			"context": {
				"client_id": client_id,
				"ip": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
				"User-Agent": req.get('User-Agent')
			}
		}

		if (req.body.workflow == "register") {
			payload.event = "$registration.attempted"
		}
		else if (req.body.workflow == "authenticate") {
			payload.event = "$login.attempted"
		}
		else if (req.body.workflow == "forgot_password") {
			payload.event = "$password_reset_request.attempted"
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

function get_view() {
	var view = {
		castle_app_id: process.env.castle_app_id
	}

	if (process.env.location) {
		view.location = process.env.location
	}
	else {
		view.location = ""
	}

	return view
}