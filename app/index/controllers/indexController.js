var fs   = require('fs'),
    path = require('path'),
    jade = require('jade');

var controller = {
  
  'index': function (request, response) {

    var template = path.normalize(__dirname + '/../templates/index.jade');
    var includes = path.normalize(__dirname.split('app')[0] + 'base/templates/includes.jade');  
    
    fs.exists(template, function (exists) {
    
      if (exists) {
        
        fs.readFile(template, function (err, data) {
          
          if (err) {
            response.write('Error');
            console.log(err);
            response.end();
          }
          console.log('BUUUUUTTTTTTT');
          console.log(includes);
          console.log(__dirname);
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
  
  'login': function () {
    console.log('login');
  }

};

module.exports = controller;