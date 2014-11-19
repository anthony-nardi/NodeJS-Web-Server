var fs   = require('fs'),
    path = require('path'),
    jade = require('jade'),
    querystring = require('querystring');

var controller = {

  'index': function (request, response) {

    var template = path.normalize(__dirname + '/../templates/index.jade');
    var includes = path.normalize('base/templates/includes.jade');

    fs.exists(template, function (exists) {

      if (exists) {

        fs.readFile(template, function (err, data) {

          if (err) {
            response.write('Error');
            console.log(err);
            response.end();
          }

          var fn = jade.compile(data, {
            'filename': includes
          });

          response.write(fn({}));
          response.end();

        });

      } else {

        console.log(template + ' does not exist')

      }

    });

  },

  'save': function (request, response) {
    console.log('SAVING AUDIO');

    var postData = '';

    request.on('data', function (data) {
      postData += data;
    });

    request.on('end', function () {
      var post = querystring.parse(postData),
          bodyResponse = (function () {
            var result = '';
            for (var prop in post) {
              if (post.hasOwnProperty(prop)) {
                result += prop + ': ' + post[prop] + '\n\n';
              }
            }
            return result;
          })();
      console.log(bodyResponse)
    });
  }

};

module.exports = controller;