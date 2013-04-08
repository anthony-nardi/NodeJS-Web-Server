var fs = require('fs');

var transformUrl = function (url) {

	var url = url.split('/'), map;

	url.splice(0, 1);

	map = {

		'module':     url[0] || 'index',
		'controller': url[1] || 'index',
		'action':     url[2] || 'index'

	};

	map['path'] = './' + map['module'] + '/controllers/' + map['controller'] + 'Controller.js';

	return map;

};

var route = function (request, response) {
	/*
		A URL should always map to a function.  In this case, the first part of the
		URL is the Module, second part is the Controller, and third is the Method of
		the controller API.
	*/
	var map = transformUrl(request.url),
			path = map['path'];

		var controller = undefined;

		fs.exists(path, function (exists) {
		
			if (exists) {
				console.log(path + ' exists');
				response.writeHead(200, {'Content-Type': 'text/html'});
				require(path)[map['action']](request, response);
			} else {
				//404
				console.log(path + ' does not exist')
				response.writeHead(404, {'Content-Type':'text/plain'});
				response.write('404 Not Found');
				response.end();
			} 

		});

};

module.exports = function (request, response) {
	return route(request, response);
};