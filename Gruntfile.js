module.exports = function(grunt) {

  var fs = require('fs'),
      browserify = require('browserify');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

  // A very basic default task.
  grunt.registerTask('default', 'Log some stuff.', function() {
    grunt.log.write('Logging some stuff...').ok();
  });

  // grunt.registerTask('watch-browserify', 'Watch -> Browserify', function () {
  //   grunt.log.write('Browserifying...').ok();
  // });

  grunt.event.on('watch', function(action, filepath, target) {

    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);

    var moduleToBuild = (function () {
      var moduleName = filepath.split('skin\\js\\');
      if (moduleName.length === 2) {
        console.log(moduleName);
        moduleName = moduleName[0].split('app\\')[0];
      }
      return moduleName;
    }());

    console.log('moduleToBuild: ' + moduleToBuild);

  });

};