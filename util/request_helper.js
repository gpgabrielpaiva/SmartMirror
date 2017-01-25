const request = require('request');
require('dotenv').config()
const speaker = require('../speech/amazon-polly-speaker');


module.exports = {

	createReminder: function(date, text) {
		var self = this;
		var options = {
		  url: 'https://radiant-wave-58367.herokuapp.com/api/reminder/create',
		  headers: {
		    'x-access-token': process.env.RuleThemAllBackendAccessToken,
		  },
		  json: true,
		  body: {
		  	time: date,
		  	title: text,
		  	reminderActive: true
		  }
		};
		request.post(options, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    speaker.speak('Jag påminner dig att ' + text);
		  }
		})
	},

	logTemperature: function(temp) {
		var self = this;
		var options = {
		  url: 'https://radiant-wave-58367.herokuapp.com/api/temperature/',
		  headers: {
		    'x-access-token': process.env.RuleThemAllBackendAccessToken,
		  },
		  json: true,
		  body: {
		  	temperature: temp
		  }
		};
		request.post(options, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(body)
		  }
		})
	},

	reportMotion: function() {
		var options = {
		  url: 'https://radiant-wave-58367.herokuapp.com/api/surveillance',
		  headers: {
		    'x-access-token': process.env.RuleThemAllBackendAccessToken,
		  },
		  json: true,
		  body: {time: new Date().toISOString()}
		};
  	request.post(options, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log(body)
		  }
		})
	},
	
	// Wunderlist
	getTasks(callback){
		var options = {
		  url: 'https://a.wunderlist.com/api/v1/tasks?list_id=' + process.env.wunderlistListID,
		  headers: {
		    'X-Access-Token': process.env.wunderlistAccessToken,
		    'X-Client-ID': process.env.wunderlistClientID
		  }
		};

		request(options, function(err, resp, body){
		  if (!err && resp.statusCode === 200) {
			  const tasks = JSON.parse(body);
		    callback(tasks)
		  } else {
		    console.log('code: ', resp.statusCode, err);
		  }
		});
	},

	getForecast(callback){
		request
		.get('https://api.darksky.net/forecast/e6e170a4d778f0260cedd8d50877457d/55.6,13?lang=sv&units=si', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	let forecast = JSON.parse(body);
		    callback(forecast);
		  }
		})
	}
}