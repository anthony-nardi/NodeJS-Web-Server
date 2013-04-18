var fs = require('fs');

var transformUrl = function (request) {

	var url            = request.url,
			transformedUrl = url.split('/'), 
			referer        = request.headers.referer,
			host           = request.headers.host,
			path           = referer ? referer.split(host + '/').pop().split('/') : ['index'],
			path           = path[0] === '' ? ['index'] : path,
			map            = undefined;

	/*
		If there is a referer, then we get all of the url following the host name.
		Example: www.example.com/admin/login = admin/login = ['admin', 'login']
	*/
	transformedUrl.splice(0, 1);

	map = {

		'module'    : transformedUrl[0] || 'index',
		'controller': transformedUrl[1] || 'index',
		'action'    : transformedUrl[2] || 'index',
		'type'      : 'text/html'

	};
	/*
		The url will always map to a function.
		Example: www.example.com/admin/login = require('admin/login')['index']()
	*/
	map['path'] = './' + map['module'] + '/controllers/' + map['controller'] + 'Controller.js';
	// "./admin/controllers/indexController.js"
	/*
		Follow a convention.  The directory structure follows a certain pattern.
		
		Example:
			-server.js
			-router.js
			-admin (folder)
				-controllers (folder)
					-indexController
					-loginController
					-createContorller
				-templates (folder)
					-login.html
					-index.html
				-skin (folder)
					-css
					-js
					-images

		The url that maps to the login controller would be: www.example.com/admin/login
	*/
	if (url.indexOf('.js') !== -1) {
		
		if (path) {
			console.log('REFERER:'  + referer.split(host + '/').pop())
			map['path'] = './' + path[0] + '/skin/js/' + map['module'];
			// "./admin/skin/js/general.js"
			map['module'] = path[0];
			map['controller'] = undefined;
			map['action'] = undefined;
			map['type'] = 'application/javascript';
		
		}
		
		return map;
	
	}
	
	if (url.indexOf('.ico') !== -1) {

		if (path) {
			map['path'] = './' + map['module'];
			map['controller'] = undefined;
			map['action'] = undefined;
			map['type'] = 'image/x-icon';
		}

		return map;

	}
	
	if (url.indexOf('.css') !== -1) {
		
		if (path) {
		
			map['path'] = './' + path[0] + '/skin/css/' + map['module'];
			map['module'] = path[0];
			map['controller'] = undefined;
			map['action'] = undefined;
			map['type'] = 'text/css';
		
		}
		
		return map;
	
	}
	
	if (url.indexOf('.png') !== -1 || 
		  url.indexOf('.jpg') !== -1 || 
		  url.indexOf('.jpeg') !== -1
	) {
		
		if (path) {
		
			map['path'] = './' + path[0] + '/skin/images/' + map['module'];
			map['module'] = path[0];
			map['controller'] = undefined;
			map['action'] = undefined;
			map['type'] = url.indexOf('.png') !== -1 ? 'image/png' : 'image/jpeg';
		
		}
		
		return map;
	
	}

	return map;

};

var route = function (request, response) {
	/*
		A URL should always map to a function.  In this case, the first part of the
		URL is the Module, second part is the Controller, and third is the Method of
		the controller API.
	*/
	
	var map = transformUrl(request),
			path = map['path'];

		fs.exists(path, function (exists) {
		
			if (exists) {
				console.log(path + ' exists');

					response.writeHead(200, {'Content-Type': map['type']});
					
					if (!map['action']) {
						fs.readFile(map['path'], function (err, data) {
							if (err) {
								response.write('Error');
								console.log(err);
								response.end();
							}

							response.write(data);
							response.end();

						});
					} else {
						require(path)[map['action']](request, response);
					}
					

			} else {
				//404
				console.log(map)
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