moduleLoader.imports('unit', ['inputs', 'events'], function (inputs, events) {
  
  var prototype = {
    
    'x': undefined,
    'y': undefined,
    
    'height': undefined,
    'width' : undefined,
    
    'color' : undefined,
    
    'speed' : undefined,
    
    'state' : {},
    
    'handle': {},

    'vectors': {

    },
    
    'inputs': function () {

      inputs.inputs.call(this, this);

      return this;
      
    },

  }.extend(events);

  return prototype;

});