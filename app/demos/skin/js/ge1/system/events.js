moduleLoader.imports("events", [], function () {

  var list = [],

  on = function (name, callback) {
  
    if (!list[name]) {
    
      this instanceof Node ? this.addEventListener(name, fire) : window.addEventListener(name, fire);

      list.push(name);
      list[name] = [];
      list[name].push([this, callback]);
    
    } else { list[name].push([this, callback]); }

    return this;

  },

  off = function (name, callback, opt) {

    var event = list[name];

    if (opt) { 
      this instanceof Node ? this.removeEventListener(name, fire) 
      : window.removeEventListener(name, fire); 
    }

    if (event.length) {

      for (var i = 0; i < event.length; i += 1) {
        if (event[i][0] === this && event[i][1] === callback) {
          event.splice(i, 1);
          i -= 1;
        } 
      }
    
    }

    return this;

  },

  
  fire = function (event) {
      
    var type      = typeof event === "string" ? event : event.type,        
        data      = typeof event === "string" ? arguments[1] : event,        
        listeners = list[type],
        listener  = undefined;

    if (listeners.length) {
      for (var i = 0; i < listeners.length; i += 1) {
        listener = listeners[i];
        listener[1].call(listener[0], data);
      }
    }

    return this;       
  
  },

  events = {
    'on'  : on,
    'off' : off,
    'fire': fire
  };

  return events;

});