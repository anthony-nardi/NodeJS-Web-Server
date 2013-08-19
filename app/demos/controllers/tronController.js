var fs   = require('fs'),
    path = require('path'),
    jade = require('jade');

var controller = {
  
  'index': function (request, response) {

    var template = path.normalize(__dirname + '/../templates/tron.jade');
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

  }

};

module.exports = controller;