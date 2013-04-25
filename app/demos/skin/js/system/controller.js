moduleLoader.imports("controller", 

(function() {

  moduleLoader.allModules.splice(moduleLoader.allModules.indexOf("controller"), 1)

  return moduleLoader.allModules;

}()), 

function() {
  
  var modules = moduleLoader.list, 
      modulesLength = modules.length,
      allModulesLength = moduleLoader.allModules.length,  
      clock = modules.clock,
      success = (modulesLength - 1) === allModulesLength;

  modules.sort();
  moduleLoader.allModules.sort();

  console.log("Successful module import: " + success);
  console.log("Module list: " + modules);
  
  if (success) clock.start();

});
