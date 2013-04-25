moduleLoader.imports('inputs', ['events', 'canvas'], function (events, canvas) {

  var list = [],

  inputMap = {

    'UP'   : 38,
    'DOWN' : 40,
    'LEFT' : 37,
    'RIGHT': 39,
    'PAUSE': 80,
    'SPACE': 32
  
  },

  handleKey = function (e) {

    var type = e.type;
    
    if (!list[type]) {
      list[type] = [];
    }

    switch(e.keyCode) {
    
      case inputMap.UP:
        list[type]['UP'] = true;
        break;
    
      case inputMap.DOWN:
        list[type]['DOWN'] = true;
        break;
    
      case inputMap.LEFT:
        list[type]['LEFT'] = true;
        break;
    
      case inputMap.RIGHT:
        list[type]['RIGHT'] = true;
        break;

      case inputMap.SPACE:
        list[type]['SPACE'] = true;

      case inputMap.PAUSE:
        list[type]['PAUSE'] = true;
    
      default:
        break;

    }

  },

  handleMouse = function (e) {

    var c = canvas.getCanvas(e.target.id);

    if (e.preventDefault) {  
      e.preventDefault();  
    }
    
    e.returnValue = false;

    if (this === c.element) {
    
      c.cachePixelCoodinates(e);

    }
    
    list[e.type] = e;
  
  },

  handleDefault = function (e) {
    
    if (e.preventDefault) {  
      e.preventDefault();  
    }
    
    e.returnValue = false;
    
    list[e.type] = e;

  },

  inputs = {
    
    'clear': function () {
   
      list = [];
   
    },
   
    'dispatch': function () {
   
      events.fire('inputs', list);
   
    },
   
    'inputs': function (object) {

      events.on.call(object, 'inputs', function (eventList) {
      
        for (event in eventList) {
          
            if (!eventList.hasOwnProperty(event) || !this.handle[event]) continue;
            
            this.handle[event].call(this, eventList[event]);
          
          }
      
      });

      return this;
    
    }
  
  };

  canvas.extend({
  
    'registerCanvas' : function () {

      var canvasElement = this.getElement();
      
      events.on.call(canvasElement, 'click', handleMouse);
      events.on.call(canvasElement, 'mouseup', handleMouse);
      events.on.call(canvasElement, 'mousedown', handleMouse);
      events.on.call(canvasElement, 'mousemove', handleMouse);
      
      events.on.call(this, 'inputs', function (eventList) {
        
        for (event in eventList) {
        
          if (!eventList.hasOwnProperty(event) || !this.handle[event]) continue;
          
          this.handle[event].call(this, eventList[event]);
        
        }

        return this;

      });

    },

    'cachePixelCoodinates': function (mouseEvent) {

      this.setLastPointerPosition(this.getCurrentPointerPosition());
      this.setCurrentPointerPosition(this.translateEventToPointerPosition(mouseEvent));
      
      return this;

    }
  
  });
  
  events.on('keydown', handleKey);
  events.on('keyup', handleKey);
  events.on('mousewheel', handleDefault);

  return inputs;

});