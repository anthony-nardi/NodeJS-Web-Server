var gravity = 10000

if (!Math.getRandomInt) {
  
  Math.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}

if (!Object.prototype.extend) {

  Object.prototype.extend = function (object) {

    for (key in object) {

      if (typeof object[key] === 'object' 
         && typeof this[key] === 'object'
         && this.hasOwnProperty(key)) {
        
        this[key].extend(object[key]);
      
      } else {
      
        this[key] = object[key];
      
      }
    }
    
    return this;
  
  };

}

moduleLoader(['components','entities','system'])(
  ['extend','vector','ship','inputs', 'clock',
   'events','canvas', 'grid','viewport','movers', 'collision',
   'fps','mainView','unit','controller']
);