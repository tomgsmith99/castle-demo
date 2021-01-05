
var request = require('request');

// var session = require("express-session");

//*******************************************/

module.exports = function (app) {

	app.get('/favicon.ico', function(req, res, next) {

		res.sendStatus(200)
	})

	app.get('/', function(req, res, next) {

		var view = {
			castle_app_id: process.env.castle_app_id
		}
		res.render('index', view)
	})

	//*******************************************/

	app.post('/evaluate_reg_form', function(req, res) {

		console.log("received a submission.")

		console.dir(req.body)

		client_id = req.body.clientId

		email = req.body.email

		payload = {
			"event": "$login.attempted",
			"user_traits": {
				"email": email
			},
			"context": {
				"client_id": client_id,
				"ip": "127.0.0.1",
				"User-Agent":"Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko"
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
			if (error) throw new Error(error);
			console.log(response.body);
		})

		res.json({"result": "success"})
	})
}