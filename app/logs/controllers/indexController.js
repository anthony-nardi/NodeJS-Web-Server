'use strict';

var fs   = require('fs'),
    path = require('path'),
    jade = require('jade'),
    pg   = require('pg');

var controller = {

  'index': function (request, response, logger) {

    var template = path.normalize(__dirname + '/../templates/index.jade');
    var includes = path.normalize('base/templates/includes.jade');

    pg.connect('postgres://anardi:password@localhost', function(err, client) {

      if (err) console.log('ERROR CONNECTING TO POSTGRES', err);

      client.query('select orig_message, nice_message, date, modulename from log left outer join modules on (log.moduleid = modules.moduleid)', function(err, result) {

        if(err) {
         return console.error('error running query', err);
        }

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

              response.write(fn({
                'logs': result.rows
              }));

              response.end();

            });

          } else {

            console.log(template + ' does not exist')

          }

        });

        client.end();

      });

    });
  }
};

module.exports = controller;