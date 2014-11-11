'use strict';

module.exports = (function () {

  var bounds     = require('../util/math/bounds'),
      intersects = require('../util/math/intersects'),
      within     = require('../util/math/within');

  var createQuadTree = (function () {

        var boxPrototype = {

          // What quadrants does this box fall within relative to its root?
          //
          // *********************
          // *         *         *
          // *    1    *    4    *
          // *         *         *
          // *         *         *
          // *********************
          // *         *         *
          // *    2    *    8    *
          // *         *         *
          // *         *         *
          // *********************
          'quadrant': undefined, // See above.

          'collidesList' : function () {

            // Get all objects that have a decent chance of colliding with this object
            var children = this.root.getChildren(this, true)
                               .concat(this.root.getOrphans())
                               .concat(this.root.rootOrphanOverlap()),
                list = [];

            children.splice(children.indexOf(this), 1);

            for (var i = 0; i < children.length; i += 1) {
              if (intersects(this, children[i])) list.push(children[i]);
            }

            return list;
          },

          'move': function (x, y) {

            this.x = x;
            this.y = y;

            if (this.root.orphans.indexOf(this) > -1 || !within(this, this.root)) {
              // Update the parent if this is not completely within the parent leaf.
              // Update the parent if this is an orphan
              try {
                this.updateParent();
              } catch (e) {
                //console.log(this);
              }
            }

            return this;

          },

          'updateParent' : function () {
            this.remove().insert();
            return this;
          },
          'remove' : function () {
            this.root.remove(this);
            return this;
          },
          'insert' : function () {
            this.root.insert(this);
            return this;
          },

        };

        var leafBoundPrototype = {

          'containsPoints': true,

          'insert': function (obj) {


            if (obj instanceof Array) {
              for (var i = 0; i < obj.length; i += 1) {
                this.insert(obj[i]);
              }
              return;
            }

            if (!obj.root) {
              obj.extend(boxPrototype);
            }

            var leafBounds  = bounds(this),
                objBounds   = bounds(obj),
                leftOfLeaf  = (objBounds.left   <= leafBounds.left),
                rightOfLeaf = (objBounds.right  > leafBounds.right),
                aboveLeaf   = (objBounds.top    <= leafBounds.top),
                belowLeaf   = (objBounds.bottom > leafBounds.bottom),
                leafHWidth  = this.width  / 2,
                leafHHeight = this.height / 2,
                quadrant    = (obj.x <= this.x ? 0 : 2) +
                              (obj.y <= this.y ? 0 : 1);

            // console.log('Inserting ' + obj + ' into the quadTree in quadrant ' + quadrant);
            // console.log(objBounds);

            if (leftOfLeaf || rightOfLeaf || aboveLeaf || belowLeaf) {

              if (this.quadrant) {
                /*
                  if the object is not contained within the current leaf and
                  the leaf is a quadrant of another leaf, insert it into that leaf...
                */
                return this.root.insert(obj);
              }
              /*
                if the object is not contained within the leaf and there isnt
                a parent leaf
              */
              if (leftOfLeaf) {
               // console.log('WHILE left')
                while (obj.x <= leafBounds.left) {
                  obj.x = leafBounds.right + obj.x + leafHWidth;
                }
              }
              if (rightOfLeaf) {
               // console.log('WHILE right')
                while (obj.x > leafBounds.right) {
                  obj.x = leafBounds.left + obj.x - leafHWidth;
                }
              }
              if (aboveLeaf) {
              //  console.log('WHILE above')
                while (obj.y <= leafBounds.top) {
                  obj.y = leafBounds.bottom + obj.y + leafHHeight;
                }
              }
              if (belowLeaf) {
                //console.log('WHILE below')
                while (obj.y > leafBounds.bottom) {
                  obj.y = leafBounds.top + obj.y - leafHHeight;
                }
              }
              objBounds = bounds(obj);
            }

            if (this.containsPoints) {
              //If this leaf contains points, then we can insert the object into it
              obj.root = this;
              obj.quadrant = this.quadrant;

              this.children.push(obj);
              //console.log('Pushed object into quadTree children.');
              if (this.maxChildren < this.children.length && this.maxDepth) {
                this.burst();
              }

            } else {
              /*
                At this point, we know that the object is completely contained
                in a leaf that has sub-leafs.  We must now determine whether or not
                the object is an orphan of the leaf or can be inserted into a sub-leaf.
              */
           //   console.log('Found subleaf');
              var subleaf = this.children[quadrant],
                  subleafBounds = bounds(subleaf),
                  withinSubleaf = (objBounds.left > subleafBounds.left &&
                                  objBounds.right <= subleafBounds.right &&
                                  objBounds.top > subleafBounds.top &&
                                  objBounds.bottom <= subleafBounds.bottom);

              if (withinSubleaf) {
              //  console.log('Completely within subleaf');
                return subleaf.insert(obj);
              } else {
             //   console.log('Gonna be an orphan');
                obj.root = this;
                obj.quadrant = this.quadrantOverlap(obj);
                this.orphans.push(obj);
                return obj;
              }
            }
            return obj;
          },

          'quadrantOverlap' : function (obj) {
            return (
              (intersects(this.children[0], obj) * 1) +
              (intersects(this.children[1], obj) * 2) +
              (intersects(this.children[2], obj) * 4) +
              (intersects(this.children[3], obj) * 8)
            );
          },

          'remove' : function (obj) {

            var pos = this.children.indexOf(obj);

            if(pos !== -1) {

              this.children.splice(pos, 1);

            } else {

              this.orphans.splice(this.orphans.indexOf(obj), 1);

            }

            if (this.root.collapse) {
              this.root.collapse();
            }

          },
          'childCount': function () {
            var sum = 0;

            if (this.containsPoints) {
              return this.children.length;
            }

            if(this.orphans.length) {
              sum += this.orphans.length;
            }

            for (var i = 0; i < this.children.length; i += 1) {
              sum += this.children[i].childCount();
            }

            return sum;
          },
          'getChildren': function (obj, root) {

            var returnList = [], quadrant;

            if (this.containsPoints) {

                returnList = this.children;

            } else {

              if (obj) {

                quadrant = root ? obj.quadrant : this.quadrantOverlap(obj);

                for (var i = 0; i < this.children.length; i += 1) {
                  if ((quadrant & this.children[i].quadrant) !== 0) {
                    returnList = returnList.concat(this.children[i].getChildren(obj));
                  }
                }
              } else {
                  for (var i = 0; i < this.children.length; i += 1) {
                    returnList = returnList.concat(this.children[i].getChildren());
                  }
              }

            }

            return returnList;

          },
          'getOrphans' : function () {

            var returnList = [];

            if (!this.containsPoints) {

              returnList = this.orphans;

              for (var i = 0; i < this.children.length; i += 1) {
                returnList = returnList.concat(this.children[i].getOrphans());
              }

            }

            return returnList;

          },
          'rootOrphanOverlap': function () {
            /*
              Search every orphan on the root of this leaf that may overlap with this leaf
            */
            var returnOrphans = [],
                orphans = this.root.orphans;

            if (!orphans) return returnOrphans;

            for (var i = 0; i < orphans.length; i += 1) {
              if (orphans[i].quadrant & this.quadrant === this.quadrant) {
                returnOrphans.push(orphans[i]);
              }
            }

            returnOrphans = returnOrphans.concat(this.root.rootOrphanOverlap());

            return returnOrphans;

          },
          'collapse': function () {
            /*
              Collapse is called like this:
                 Object.root.remove -> Object.root.root.collapse
              so basically, when an object in the quadTree removes itself, its root removes it
              from itself and then calls collapse on ITS root. (the objects roots root)

              We know that objects are only contained within leafs that contain points only,
              therefore it only makes sense to collapse its roots root...

              So if the leaf we are collapsing contains less than or an equal amount of objects
              than its maxChildren property, then we should gather all of the leafs orphans and
              children and make them children of the leaf.
            */
            if (this.childCount() <= this.maxChildren && this.children[0].containsPoints) {
              
              this.children = this.getChildren().concat(this.getOrphans());
              
              for (var i = 0; i < this.children.length; i += 1) {
                this.children[i].root = this;
              }

              this.orphans        = [];
              this.containsPoints = true;
              this.checkForDuplicates(this.children);
            }

          },

          'spawn': function () {

            var root   = this,
                x      = this.x,
                y      = this.y,
                width  = this.width  / 4,
                height = this.height / 4;

            this.containsPoints = false;

            return [

              // Top-Left
              createQuadTree({
                'root'     : root,
                'x'        : x - width,
                'y'        : y - height,
                'quadrant' : 1,
                'bounds'   : true
              }),

              // Bottom-left
              createQuadTree({
                'root'     : root,
                'x'        : x - width,
                'y'        : y + height,
                'quadrant' : 2,
                'bounds'   : true
              }),

              // Top-Right
              createQuadTree({
                'root'     : root,
                'x'        : x + width,
                'y'        : y - height,
                'quadrant' : 4,
                'bounds'   : true
              }),

              // Bottom-Right
              createQuadTree({
                'root'     : root,
                'x'        : x + width,
                'y'        : y + height,
                'quadrant' : 8,
                'bounds'   : true
              })
            ];
          },

          'burst': function () {

            // These children are boxes (not bounding leafs)
            var children = this.children;

            // Now, these children are bounding leafs
            this.children = this.spawn();

            // Don't forget to insert the boxes into our bounding leafs (unless they are orphans!)
            for (var i = 0; i < children.length; i += 1) {
              this.insert(children[i]);
            }

          },

          'getQuadrantList': function (object) {
            
            var quadrantList = [],
                currentRoot  = object.root;
            
            if (!object.quadrant) {
              console.error('Object does not have quadrant property.');
              return;
            }
            
            quadrantList.push(object.quadrant);
            
            while (currentRoot.quadrant) {
              quadrantList.push(currentRoot.quadrant);
              currentRoot = currentRoot.root;
            }
            
            return quadrantList;

          },

          'checkForDuplicates': function (objects) {
            var root = (function (currentRoot) {
              while (currentRoot.root && currentRoot.root.root) {
                currentRoot = currentRoot.root;
              }
              return currentRoot;
            }(this));
            console.log('Checking for any duplicates in ' + root);
            var allChildren = [].extend(root.getChildren());
            var allOrphans  = [].extend(root.getOrphans());
            var allBoxesCount = allChildren.length + allOrphans.length;
            if (allBoxesCount !== root.childCount()) {
              console.error('WTF!');
            }
            for (var i = 0; i < objects.length; i += 1) {
              if (allChildren.indexOf(objects[i]) !== -1) {
                allChildren.splice(allChildren.indexOf(objects[i]), 1);
                if (allOrphans.indexOf(objects[i]) !== -1) {
                  console.error('DUPLICATE FOUND IN ORPHANS');
                }
              }
            }
            for (var i = 0; i < objects.length; i += 1) {
              if (allOrphans.indexOf(objects[i]) !== -1) {
                allOrphans.splice(allOrphans.indexOf(objects[i]), 1);
                if (allChildren.indexOf(objects[i]) !== -1) {
                  console.error('DUPLICATE FOUND IN CHILDREN');
                }
              }
            }
          }

        };

        /**
         * [description]
         * @param  {[Object]} config [The configuration for the quadTree instance]
         * @return {[type]}        [description]
         */
        return function (config) {

          config.root = config.root || {};

          return Object.create(leafBoundPrototype).extend({
            
            'width'       : config.width       || (config.root.width  ? config.root.width  / 2 : 1920),
            'height'      : config.height      || (config.root.height ? config.root.height / 2 : 1080),
            'halfWidth'   : config.width  / 2  || (config.root.width  ? config.root.width  / 4 : 960),
            'halfHeight'  : config.height / 2  || (config.root.height ? config.root.height / 4 : 540),
            'maxChildren' : config.maxChildren || 4,
            'maxDepth'    : config.root.maxDepth ? config.root.maxDepth - 1 : (config.maxDepth || 4),
            'root'        : config.root,
            'quadrant'    : config.quadrant || undefined,
            'x'           : config.x || 0,
            'y'           : config.y || 0,
            'children'    : [],
            'orphans'     : []

           });
          };

      }());

  return function (config) {
    return createQuadTree(config || {});
  };

}());

