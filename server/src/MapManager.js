var CellAuto = require('./cellauto');

var mapGrid = [];

module.exports = (function() {
  function Box(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  var map = [];


  //for (var i = 0; i < 100; i++) {
  //  map.push(new Box(i*64 - 500, 500, 64, 64))
  //}

  function getCurrentMap() {
    return map;
  }

  // TODO: make configurable
  function getWidth() { return 50; }
  function getHeight() { return 40; }

  function findBlankSpace() {
    // TODO: make random location
    for (var j=0; j<getHeight(); j++) {
      for (var i=0; i<getWidth(); i++) {
        // find four blank tiles
        if (mapGrid[j][i] === 0 &&
            mapGrid[j+1] && mapGrid[j+1][i] === 0 &&
            mapGrid[j+1] && mapGrid[j+1][i+1] === 0 &&
            mapGrid[j][i+1] === 0
        ) {
          return { x: i, y: j};
        }
      }
    }

    return { x: 1, y: -1};
  }

  function generateMap() {
    var world = new CellAuto.World({
      width: getWidth(),
      height: getHeight()
    });

    world.registerCellType('wall', {
      process: function (neighbors) {
        var surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasOpen');
        this.open = (this.wasOpen && surrounding >= 4) || surrounding >= 6;
      },
      reset: function () {
        this.wasOpen = this.open;
      }
    }, function () {
      //init
      this.open = Math.random() > 0.40;
    });

    world.initialize([
      {name: 'wall', distribution: 100}
    ]);

    // generate our cave, 10 steps aught to do it
    for (var i = 0; i < 10; i++) {
      world.step();
    }

    mapGrid = world.createGridFromValues([
      {cellType: 'wall', hasProperty: 'open', value: 0}
    ], 1);

    for (var j = 0; j < world.height; j++) {
      for (var i = 0; i < world.width; i++) {
        if (mapGrid[j][i]) {
          map.push(new Box(i * 64, j * 64, 64, 64));
        }
      }
    }
  }

  return {
    getCurrentMap: getCurrentMap,
    generateMap: generateMap,
    findBlankSpace: findBlankSpace,
    getWidth: getWidth,
    getHeight: getHeight
  }
}());
