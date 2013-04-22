var http = require('http'),
    router = require('./router');

var requestListener = function (request, response) {
  router(request, response);
}

http.Server(requestListener).listen(8888);