'use strict';

var fs          = require('fs'),
    querystring = require('querystring');

var controller = {

  'index': function (request, response) {

    var postData = '';

    request.on('data', function (data) {
      postData += data;
    });

    request.on('end', function () {
      var smsPost = querystring.parse(postData),
          smsResponse = (function () {
            var result = '';
            for (var prop in smsPost) {
              if (smsPost.hasOwnProperty(prop)) {
                result += prop + ': ' + smsPost[prop] + '\n\n';
              }
            }
            return result;
          })();
      response.writeHead(200, {'Content-Type': 'text/xml'});
      response.end('<Response><Message>' + smsResponse + '</Message></Response>');
    });

  }
};

module.exports = controller;