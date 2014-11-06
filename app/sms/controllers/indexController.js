'use strict';

var fs   = require('fs');

var controller = {

  'index': function (request, response) {

    var postData = '';

    request.on('data', function (data) {
      postData += data;
    });

    request.on('end', function () {
      response.writeHead(200, {'Content-Type': 'text/xml'});
      response.end('<Response><Message>Oh yeah baybay!</Message></Response>');
    });

  }
};

module.exports = controller;