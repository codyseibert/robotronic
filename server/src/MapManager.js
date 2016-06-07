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

  function getCurrentMap() {
    return map;
  }

  var mapMemo = {};

  function getI(x) {
    return parseInt(x / 64);
  }

  function getJ(y) {
    return parseInt(y / 64);
  }

  function getBlocksNear(obj, dist) {
    var i = getI(obj.x);
    var j = getJ(obj.y);

    var key = i + " " + j;

    if (mapMemo[key]) {
      return mapMemo[key];
    } else {
      mapMemo[key] = [];
      for (var i = 0, len = map.length; i < len; i++) {
        var block = map[i];
        var dx = obj.x - block.x;
        var dy = obj.y - block.y;
        var distance = Math.sqrt(dx*dx + dy*dy);
        if (distance < dist) {
          mapMemo[key].push(block);
        }
      };
      return mapMemo[key];
    }
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

  function findBlankTile() {
    do {
      var rj = parseInt(Math.random() * getHeight());
      var ri = parseInt(Math.random() * getWidth());
      if (mapGrid[rj][ri] === 0) {
        return {
          x: ri * 64 + 32,
          y: rj * 64 + 32
        }
      }
    } while (true)
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
        if (mapGrid[j][i] || j === 0 || i === 0 || j === world.height - 1 || i === world.width - 1) {
          map.push(new Box(i * 64, j * 64, 64, 64));
          mapGrid[j][i] = 1;
        }
      }
    }
  }

  return {
    getCurrentMap: getCurrentMap,
    generateMap: generateMap,
    findBlankSpace: findBlankSpace,
    findBlankTile: findBlankTile,
    getWidth: getWidth,
    getHeight: getHeight,
    getBlocksNear: getBlocksNear
  }
}());
