'use strict';

// The purpose of normalizeRequest is to map any request to our server to
// a function or static resource.
//
// Below are a examples to URLs and their mapped result:
//    www.example.com       -> index/index/index (module/controller/method)
//    www.example.com/a     -> a/index/index     (module/controller/method)
//    www.example.com/a/b/c -> a/b/c             (module/controller/method)
//
//    (module/controller/method)
//
//    module     - folder
//    controller - file
//    method     - javascript method
//
//    The module/controller/method is only part of the path to find the callback
//    for any URL.  Multiple variations of the complete path are created because
//    of how the webserver features work.  The first place all normalized URLs are
//    checked is in the 'app' folder.  If nothing is found, the it is checked in
//    the 'base' folder.  If nothing is found, then 404.

function normalizeRequest (request) {

  var url     = request.url,
      referer = request.headers.referer,
      host    = request.headers.host,

      staticPath = (function () {

        var staticPath = ['index'];

        if (referer) {

          staticPath = referer.split(host + '/').pop().split('/');

          if (staticPath[0] === '') {
            staticPath = ['index'];
          }

        }

        return staticPath;

      }()),

      /*
      (notice how the referer has /index and the url does not)

      URL (STATIC FILE) = /admin/login/general.js
      REFERER           = www.example.com/admin/login/index
      HOST              = www.example.com
      STATICPATH        = www.example.com/admin/login/index -> /admin/login/index
      STATICRESOURCE    = /admin/login/index -> /admin/login -> URL.split(/admin/login) -> /general.js

      ONLY static file requests have a referer property, which gives us the URL the file was requested from.
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
        var result;

        if (staticPath[staticPath.length - 1] === 'index') {
          staticPath.pop();
          result = url.split(staticPath.join('/') + '/').pop();
          staticPath.push('index');
          return result;
        } else {
          return url.split([staticPath[0]].join('/') + '/').pop();
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

  console.log('\n---------------------------------------------------------\n');
  console.log('URL             : ' + url);
  console.log('REFERER         : ' + referer);
  console.log('HOST            : ' + host);
  console.log('STATIC_PATH     : ' + staticPath);
  console.log('STATIC_RESOURCE : ' + staticResource);

  if (url.indexOf('.js') !== -1) {
    return normalizeJS(request, config);
  }

  if (url.indexOf('.css') !== -1) {
    return normalizeCSS(request, config);
  }

  if ( url.indexOf('.png')  !== -1 ||
       url.indexOf('.jpg')  !== -1 ||
       url.indexOf('.jpeg') !== -1) {

    return normalizeIMG(request, config);

  }

  if (url.indexOf('.mp3') !== -1) {
    return normalizeMP3(request, config);
  }

  if (url.indexOf('.ico') !== -1) {

    if (staticPath) {
      config.path       = './' + config.module;
      config.controller = undefined;
      config.action     = undefined;
      config.type       = 'image/x-icon';
      config.app        = false;
    }
    return config;
  }


  // If the request isn't for a static file, then it must be a controller...
  config.path = '/' + config.module + '/controllers/' + config.controller + 'Controller.js';

  return config;

}

function normalizeJS (request, config) {

  if (config.staticPath) {
    config.path       = '/' + config.staticPath[0] + '/skin/js/' + config.staticResource;
    config.module     = config.staticPath[0];
    config.controller = undefined;
    config.action     = undefined;
    config.type       = 'application/javascript';
  }

  return config;

}

function normalizeIMG (request, config) {

  if (config.staticPath) {
    config.path       = '/' + config.staticPath[0] + '/skin/images/' + config.staticResource;
    config.module     = config.staticPath[0];
    config.controller = undefined;
    config.action     = undefined;
    config.type       = request.url.indexOf('.png') !== -1 ? 'image/png' : 'image/jpeg';
  }

  return config;

}

function normalizeCSS (request, config) {

  if (config.staticPath) {
    config.path       = '/' + config.staticPath[0] + '/skin/css/' + config.staticResource;
    config.module     = config.staticPath[0];
    config.controller = undefined;
    config.action     = undefined;
    config.type       = 'text/css';
  }

  return config;

}

function normalizeMP3 (request, config) {

  if (config.staticPath) {
    config.path       = '/' + config.staticPath[0] + '/skin/audio/' + config.staticResource;
    config.module     = config.staticPath[0];
    config.controller = undefined;
    config.action     = undefined;
    config.type       = 'audio/mpeg3';
  }

  return config;

}

module.exports = function (request) {
  return normalizeRequest(request);
};