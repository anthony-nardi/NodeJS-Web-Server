'use strict';

var fs   = require('fs');

var controller = {

  'index': function (request, response) {

    var postData = '';

    request.on('data', function (data) {
      postData += data;
    });

    request.on('end', function () {
      fs.writeFile('message.txt', postData, function (err) {
        if (err) throw err;
      });
    });

  }
};

module.exports = controller;