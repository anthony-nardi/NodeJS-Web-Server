'use strict';

var PORT    = 5000,
	  http    = require('http'),

  	/**
  	 * [router routes our http requests to our framework.]
  	 * @type {[Function expression]}
  	 */

    router  = require('./router'),
    db      = require('./db'),

    app    	= http.Server(requestListener);

function requestListener (request, response) {

  // These objects should reference the server object because
  // only certain requests are set up with a socket connection.
  request.app  = app;
  response.app = app;
  response.logger = db.logger;

  router(request, response);

}

app = http.Server(requestListener);

app.listen(process.env.PORT || PORT);

console.log( 'Server running on port ' + PORT );
