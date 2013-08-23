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

moduleLoader(['ge1/components','ge1/entities','ge1/system'])(
  ['extend','vector','ship','inputs', 'clock',
   'events','canvas', 'grid','viewport','movers', 'collision',
   'fps','mainView','unit','controller']
);

if (document.getElementById('viewport')) {
  document.getElementById('viewport').width = document.getElementById('container').offsetWidth;
  document.getElementById('viewport').height = document.getElementById('container').offsetHeight;
}