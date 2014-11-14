'use strict';

  var normalizeRequest = require('./normalizeRequest'),
      fs               = require('fs');

/**
* [route normalizes http requests, mapping urls to functions, or files...]
* @param  {[object http.IncomingMessage]} request  [http request from ]
* @param  {[object http.ServerResponse]}  response [description]
* @return {[undefined]}                            [undefined]
*/
function route (request, response) {

  var map  = normalizeRequest(request),
      path = map.path,
      app  = map.app,
      logger = response.logger,

      searchPath  = app ? './app' + path : path,
      defaultPath = './base/skin' + path.split('skin')[1];

  console.log('\n*************SERVER STATUS***************\nSEARCH ' + searchPath);


  fs.exists(searchPath, function (exists) {

    if (exists) {

      console.log('200: ' + searchPath);

      response.writeHead(200, {'Content-Type': map.type });

        if (!map.action) {

          fs.readFile(searchPath, function (err, data) {

            if (err) {

              response.write('Error');
              console.log(err);
              response.end();

            }

            response.write(data);
            response.end();

          });
        } else {
          require(searchPath)[map.action](request, response, logger);
        }


    } else {

      console.log('404: ' + searchPath + ' SEARCH ' + defaultPath);

      fs.exists(defaultPath, function (exists) {

        if (exists) {

          console.log('200: ' + defaultPath);
          response.writeHead(200, {'Content-Type': map.type});

          if (!map.action) {

            fs.readFile(defaultPath, function (err, data) {

              if (err) {

                response.write('Error');
                console.log(err);
                response.end();

              }

              response.write(data);
              response.end();

            });
          } else {
            require(defaultPath)[map.action](request, response, logger);
          }

        } else {
          console.log('404: ' + defaultPath);
          response.writeHead(404, {'Content-Type':'text/html'});
          require('./base/controllers/404')[map.action](request, response, logger);
        }

      });

    }

  });

}

module.exports = function (request, response) {
  return route(request, response);
};