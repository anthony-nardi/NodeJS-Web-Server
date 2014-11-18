'use strict';

var pg = require('pg'),

    persistentClient,

    moduleMap = {},

    connectionString = process.env.DATABASE_URL || 'postgres://anardi:password@localhost';

pg.connect(connectionString, function(err, client) {

  if (err) {
    console.log('ERROR CONNECTING TO POSTGRES', err);
    return;
  }

  persistentClient = client;

  createTables();

});

function logger (moduleName, orig_message, nice_message) {

  var table = 'log',
      moduleId = moduleMap[moduleName],
      query;

  if (!persistentClient) {
    console.log('WARN: Could not use database.');
    console.log(orig_message);
    console.log(nice_message);
  } else {

    /*
      'INSERT INTO log VALUES (0, \'original message\', \'nice message\', \'788741233\')'
    */

    console.log('LOGGING TO DB!!!!');

    query = 'INSERT INTO ' + table +
            ' VALUES (' + moduleId + ', \'' +
                          orig_message + '\', \'' +
                          nice_message + '\', \'' +
                          Date.now() + '\')';

    persistentClient.query(query, function (err, result) {
      if (err)    console.log(err);
      if (result) console.log(result);
    });

  }

}

function createLogTable () {
  var query = 'CREATE TABLE IF NOT EXISTS log ( moduleId integer NOT NULL, orig_message text, nice_message text, date bigint )';
  persistentClient.query(query, function (err, result) {
    if (err)    console.log('ERR: ', err);
    if (result) console.log('RES: ', result);
  });
}

function createModulesTable () {
  var query = 'CREATE TABLE IF NOT EXISTS modules ( moduleId integer NOT NULL, moduleName varchar(40) NOT NULL )';
  persistentClient.query(query, function (err, result) {
    if (err) {
      console.log('ERR: ', err);
    }
    if (result) {
      console.log('RES: ', result);
      populateModulesTable();
    }
  });
}

function createAudioTable () {
  var query = 'CREATE TABLE IF NOT EXISTS audio ( id bigserial NOT NULL, data text )';
  persistentClient.query(query, function (err, result) {
    if (err) {
      console.log('ERR: ', err);
    }
    if (result) {
      console.log('RES: ', result);
    }
  });
}

function populateModulesTable () {
  var selectQuery = 'SELECT * FROM modules',
      insertQuery = 'INSERT INTO modules VALUES ' +
                    '(0, \'core\'), ' +
                    '(1, \'about\'), ' +
                    '(2, \'admin\'), ' +
                    '(3, \'audio\'), ' +
                    '(4, \'blog\'), ' +
                    '(5, \'demos\'), ' +
                    '(6, \'index\'), ' +
                    '(7, \'logs\'), ' +
                    '(8, \'music\'), ' +
                    '(9, \'quad\'), ' +
                    '(10, \'sms\'), ' +
                    '(11, \'thoughts\')';
  persistentClient.query(selectQuery, function (err, result) {
    if (err) {
      console.log('ERR: ', err);
      return;
    }
    if (!result.rows || !result.rows.length) {
      persistentClient.query(insertQuery, function (err, result) {
        if (err) {
          console.log('ERR: ', err);
          return;
        }
        console.log('RES: ', result);
        setModuleMap();
      })
    } else {
      setModuleMap(result);
    }
  });
}

function setModuleMap (result) {

  var selectQuery = 'SELECT * FROM modules';

  if (result) {
    for (var i = 0; i < result.rows.length; i += 1) {
      moduleMap[result.rows[i].modulename] = result.rows[i].moduleid;
    }
    console.log(moduleMap);
  } else {
    persistentClient.query(selectQuery, function (err, result) {
      if (err) {
        console.log('ERR: ', err);
        return;
      }
      for (var i = 0; i < result.rows.length; i += 1) {
        moduleMap[result.rows[i].modulename] = result.rows[i].moduleid;
      }
      console.log(moduleMap);
    });
  }
}

function createTables () {
  createLogTable();
  createModulesTable();
}

module.exports = {
  'logger': logger
};