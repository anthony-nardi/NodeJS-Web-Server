var fs = require('fs');

var conformRequest = function (request) {

  var url            = request.url,
      referer        = request.headers.referer,
      host           = request.headers.host,
      
      staticPath     = referer ? referer.split(host + '/').pop().split('/') : ['index'],
      staticPath     = staticPath[0] === '' ? ['index'] : staticPath,
      /*
      (notice how the referer has /index and the url does not)
      
      URL (STATIC FILE) = /admin/login/general.js 
      REFERER = www.example.com/admin/login/index
      HOST = www.example.com
      STATICPATH = www.example.com/admin/login/index 
                    -> /admin/login/index
      STATICRESOURCE = /admin/login/index 
                    -> /admin/login 
                    -> URL.split(/admin/login)
                    -> /general.js
      */
      /*
      ONLY static file requests have a referer property, which
      gives us the URL the file was requested from. 
      */
      transformedUrl = url.split('/').splice(1, url.length - 1),
      /*
      This gives us everything following the host
      */
      staticResource = (function (staticPath) {
        /*
          If the static path ends with 'index', then we remove it because
          browsers will automatically truncate any URL with 'index' as the final
          string after the last '/'.  Therefore, we want to get the URL of the
          static file.
        */
        var result = undefined;
        
        if (staticPath[staticPath.length - 1] === 'index') {
          staticPath.pop();
          result = url.split(staticPath.join('/') + '/').pop();
          staticPath.push('index');
          return result;
        } else {
          return url.split(staticPath.join('/') + '/').pop();
        }
      
      }(staticPath)),
      
      config         = {
        
        'module'        : transformedUrl[0] || 'index',
        'controller'    : transformedUrl[1] || 'index',
        'action'        : transformedUrl[2] || 'index',
        'type'          : 'text/html',
        'staticPath'    : staticPath,
        'staticResource': staticResource,
        'app'           : true
      
      };

  console.log('---------------------------------------------------------');
  console.log('URL             : ' + url);
  console.log('REFERER         : ' + referer);
  console.log('HOST            : ' + host);
  console.log('STATIC_PATH     : ' + staticPath);
  console.log('STATIC_RESOURCE : ' + staticResource);

  if (url.indexOf('.js') !== -1) {
    return conformJS(request, config);
  }
  
  if (url.indexOf('.css') !== -1) {
    return conformCSS(request, config);
  }
  
  if ( url.indexOf('.png') !== -1 || 
       url.indexOf('.jpg') !== -1 || 
       url.indexOf('.jpeg') !== -1) {

    return conformIMG(request, config);

  }
  
  if (url.indexOf('.ico') !== -1) {

    if (staticPath) {
      config['path'] = './' + config['module'];
      config['controller'] = undefined;
      config['action'] = undefined;
      config['type'] = 'image/x-icon';
      config['app'] = false;
    }
    return config;
  }

  //If the request isn't for a static file, then it must be a controller...
  config['path'] = '/' + config['module'] + '/controllers/' + config['controller'] + 'Controller.js';

  return config;

};

var conformJS = function (request, config) {
    
  if (config.staticPath) {
    config['path']       = '/' + config.staticPath[0] + '/skin/js/' + config.staticResource;
    config['module']     = config.staticPath[0];
    config['controller'] = undefined;
    config['action']     = undefined;
    config['type']       = 'application/javascript';    
  }
  
  return config;

};

var conformIMG = function (request, config) {
    
  if (config.staticPath) {
    config['path']       = '/' + config.staticPath[0] + '/skin/images/' + config.staticResource;
    config['module']     = config.staticPath[0];
    config['controller'] = undefined;
    config['action']     = undefined;
    config['type']       = request.url.indexOf('.png') !== -1 ? 'image/png' : 'image/jpeg';
  }
  
  return config;

};

var conformCSS = function (request, config) {
    
  if (config.staticPath) {
    config['path']       = '/' + config.staticPath[0] + '/skin/css/' + config.staticResource;
    config['module']     = config.staticPath[0];
    config['controller'] = undefined;
    config['action']     = undefined;
    config['type']       = 'text/css';    
  }
  
  return config;

};


var route = function (request, response) {
  /*
    A URL should always map to a function.  In this case, the first part of the
    URL is the Module, second part is the Controller, and third is the Method of
    the controller API.
  */
  
  var map = conformRequest(request),
      path = map['path'],
      app  = map['app'],
      searchPath = app ? './app' + path : path,
      defaultPath = './base/skin' + path.split('skin')[1];

    fs.exists(searchPath, function (exists) {
    
      if (exists) {
        console.log('200: ' + searchPath + ' exists');

          response.writeHead(200, {'Content-Type': map['type']});
          
          if (!map['action']) {
            fs.readFile(searchPath, function (err, data) {
              if (err) {
                response.write('Error');
                console.log(err);
                response.end();
              }

              response.write(data);
              response.end();

            });
          } else {
            require(searchPath)[map['action']](request, response);
          }
          

      } else {
        console.log('404: ' + searchPath + ' does not exist...looking in ' + defaultPath)
        fs.exists(defaultPath, function (exists) {

          if (exists) {
            console.log('200: ' + defaultPath + ' exists in base file');
            response.writeHead(200, {'Content-Type': map['type']});
          
            if (!map['action']) {
              fs.readFile(defaultPath, function (err, data) {
                if (err) {
                  response.write('Error');
                  console.log(err);
                  response.end();
                }

                response.write(data);
                response.end();

              });
            } else {
              require(defaultPath)[map['action']](request, response);
            }

          } else {
            console.log('404: ' + defaultPath + ' does not exist')
            response.writeHead(404, {'Content-Type':'text/plain'});
            response.write('404 Not Found');
            response.end();
          }

        });

      } 

    });

};

module.exports = function (request, response) {
  return route(request, response);
};