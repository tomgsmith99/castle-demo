
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