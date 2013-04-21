var fs = require('fs');

var controller = {
	
	'index': function (request, response) {

		var template = __dirname + '\\..\\templates\\index.html';
		
		fs.exists(template, function (exists) {
		
			if (exists) {
				
				fs.readFile(template, function (err, data) {
					
					if (err) {
						response.write('Error');
						console.log(err);
						response.end();
					}

					
					response.write(data);
					response.end();
				
				});
			
			} else {
			
				console.log(template + ' does not exist')
			
			} 

		});

	},
	
	'login': function () {
		console.log('login');
	}

};

module.exports = controller;