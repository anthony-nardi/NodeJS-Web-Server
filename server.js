'use strict';

var PORT    = 5000,
	  http    = require('http'),

  	/**
  	 * [router routes our http requests to our framework.]
  	 * @type {[Function expression]}
  	 */

    router  = require('./router'),
    pg      = require('pg'),

    app    	= http.Server(requestListener),

    loggingClient;




pg.connect('postgres://anardi:password@localhost', function(err, client) {

  if (err) {
    console.log('ERROR CONNECTING TO POSTGRES', err);
    return;
  }

  loggingClient = client;

  createTables();

});

function logger (moduleId, orig_message, nice_message) {

  var table = 'log',
      query;

  if (!loggingClient) {
    console.log('WARN: Could not use database.');
    console.log(orig_message);
    console.log(nice_message);
  } else {

    /*
      'INSERT INTO log VALUES (0, \'original message\', \'nice message\', \'788741233\')'
    */

    query = 'INSERT INTO ' + table +
            ' VALUES (' + moduleId + ', \'' +
                          orig_message + '\', \'' +
                          nice_message + '\', \'' +
                          Date.now() + '\')';

    loggingClient.query(query, function (err, result) {
      if (err) console.log(err);
      if (result) console.log(result);
    });

  }

}

function createLogTable () {
  var query = 'CREATE TABLE IF NOT EXISTS log ( moduleId integer NOT NULL, orig_message text, nice_message text, date integer )';
  loggingClient.query(query, function (err, result) {
    if (err) console.log('ERR: ', err);
    if (result) console.log('RES: ', result);
  });
}

function createModulesTable () {
  var query = 'CREATE TABLE IF NOT EXISTS modules ( moduleId integer NOT NULL, moduleName varchar(40) NOT NULL )';
  loggingClient.query(query, function (err, result) {
    if (err) console.log('ERR: ', err);
    if (result) console.log('RES: ', result);
  });
}

function createTables () {
  createLogTable();
  createModulesTable();
}


function requestListener (request, response) {

  // These objects should reference the server object because
  // only certain requests are set up with a socket connection.
  request.app  = app;
  response.app = app;
  response.logger = logger;

  router(request, response);

}

app = http.Server(requestListener);

app.listen(process.env.PORT || PORT);

console.log( 'Server running on port ' + PORT );
