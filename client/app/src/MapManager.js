var CameraManager = require('./CameraManager');

module.exports = (function() {
  var map = [];
  var mapGrid = [];

  var crateImg = new Image();
  crateImg.src = "assets/images/crate.jpg";

  var tileImages = [];
  for (var i=0; i < 16; i++) {
    tileImages[i] = new Image();
    tileImages[i].src = 'assets/images/tile_'+ i + '.png';
  }

  function setMap(m) {
    map = m;

    map.forEach(function(block) {
      var x = block.x/64;
      var y = block.y/64;
      mapGrid[y] = mapGrid[y] || [];
      mapGrid[y][x] = 1;
    });

    for (var y=0; y<40; y++) {
      for (var x=0; x<50; x++) {
        mapGrid[y] = mapGrid[y] || [];
        mapGrid[y][x] = mapGrid[y][x] || 0;
      }
    }
  }

  function render(context) {
    var target = CameraManager.getTarget();
    map.forEach(function(crate) {
      if (!target) {
        return;
      }
      var dx = crate.x - target.x;
      var dy = crate.y - target.y;
      var distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < 1000) {
        var tileImage = tileImages[getNeighbors(crate.x, crate.y)];

        context.save();
        context.translate(crate.x + CameraManager.getCX(), crate.y + CameraManager.getCY());
        context.drawImage(tileImage, 0, 0);
        context.restore();
      }
    });
  }

  function getNeighbors(cx, cy) {
    var x = cx / 64;
    var y = cy / 64;

    var num = 0;
    if (mapGrid[y-1] && mapGrid[y-1][x] === 0) {
      num += 1;
    }
    if (mapGrid[y][x+1] === 0) {
      num += 2;
    }
    if (mapGrid[y+1] && mapGrid[y+1][x] === 0) {
      num += 4;
    }
    if (mapGrid[y][x-1] === 0) {
      num += 8;
    }
    return num;
  }

  return {
    render: render,
    setMap: setMap
  };
}());
