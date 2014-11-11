/*
	For all modules, watch for any changes in Javascript files.
	When a Javascript file changes, its respective bundle is
	recompiled.
*/

'use strict';

 var fs = require('fs'),
     browserify = require('browserify');

function watchJSFiles (file, index) {

  if (file.indexOf('bundle') !== -1) {
    return;
  }

  fs.stat(file, function (err, stats) {

    if (stats.isDirectory()) {

      console.log('Recursing into directory ' + file);

      fs.readdir(file, function (err, files) {

        for (var i = 0; i < files.length; i += 1) {
          watchJSFiles(file + '/' + files[i], index);
        }

      });

    } else {
      console.log('Watching ' + file + ' for changes');
      fs.watch(file, function (event, filename) {
        if (event === 'change') {
          fs.open(index + '/bundle.js', 'w', function (err, fd) {
            console.log(event + ' detected for ' + filename);
            browserify().add(index + '/index.js').bundle(function (err, buff) {
              if (err) return;
              if (!buff) return;
              fs.write(fd, buff, 0, buff.length, undefined, function (err, written) {
                if (!err && written) {
                  console.log('Bundle updated.');
                }
              });
            });
          });
        }
      });
    }
  });

}

function watchModule (path) {

  console.log('Looking for ' + path + '/skin/js/index.js');

  fs.exists(path + '/skin/js/index.js', function (exists) {

    if (exists) {

      console.log('Watching all Javascript files in ' + path + '/skin/js/');

      watchJSFiles(path + '/skin/js', path + '/skin/js');

    }

  });

}

function getModuleJavascriptFiles () {
  fs.readdir('./app', function (err, files) {
    for (var i = 0; i < files.length; i += 1) {
      watchModule('./app/' + files[i]);
    }
  });
}

getModuleJavascriptFiles();