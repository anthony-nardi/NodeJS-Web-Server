var fs = require('fs'),
    jade = require('jade');

var controller = {
  
  'index': function (request, response) {

    var template = __dirname + '\\..\\templates\\index.jade';
    
    fs.exists(template, function (exists) {
    
      if (exists) {
        
        fs.readFile(template, function (err, data) {
          
          if (err) {
            response.write('Error');
            console.log(err);
            response.end();
          }

          var fn = jade.compile(data, {});

          
          response.write(fn());
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