'use strict';

var fs   = require('fs'),
    path = require('path'),
    pg   = require('pg');

var controller = {

  'index': function (request, response) {

    pg.connect('postgres://anardi:password@localhost', function(err, client) {

      if (err) console.log('ERROR CONNECTING TO POSTGRES', err);

      client.query('SELECT * FROM log', function(err, result) {

        if(err) {
         return console.error('error running query', err);
        }

        console.log(result.rows);

        response.end(JSON.stringify(result.rows));

        //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)

        client.end();

      });

    });

  }

};

module.exports = controller;