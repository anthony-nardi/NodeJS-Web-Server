var http = require('http'),
    router = require('./router');

var requestListener = function (request, response) {
  router(request, response);
}

http.Server(requestListener).listen(process.env.PORT || 5000);