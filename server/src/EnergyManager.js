var _ = require('lodash');
var CollisionUtil = require('./CollisionUtil');
var MapManager = require('./MapManager');
var PlayerManager = require('./PlayerManager');
var Energy = require('./Energy');

var SPAWN_INTERVAL = 10;
var MAX_ENERGY = 100;

module.exports = (function() {
  var energies = [];

  function add(energy) {
    energies.push(energy);
  }

  function remove(energy) {
    energies.splice(energies.indexOf(energy), 1);
  }

  function getAll() {
    return energies;
  }

  function emitEnergy(x, y) {
    var e = new Energy();
    e.x = x;
    e.y = y;
    e.ready = false;
    e.fixed = false;
    e.vx = Math.random() * 20 - 10;
    e.vy = Math.random() * -20 - 10;
    setTimeout(function() {
      e.ready = true;
    }, 2000);

    setTimeout(function() {
      e.fixed = true;
    }, Math.random() * 1000);

    add(e);
  }

  function spawnEnergy() {
    if (energies.length > MAX_ENERGY) {
      return;
    }
    var blankTile = MapManager.findBlankTile();
    var energy = new Energy();
    energy.x = blankTile.x + parseInt(Math.random() * 56) - 28;
    energy.y = blankTile.y + parseInt(Math.random() * 56) - 28;
    energies.push(energy);
  }

  setInterval(spawnEnergy, SPAWN_INTERVAL);

  function update(delta) {
    var players = PlayerManager.getAll();

    for (var i = 0, len = energies.length; i < len; i++) {
      var energy = energies[i];

      if (!energy.ready) {
        continue;
      }

      for (var j = 0, plen = players.length; j < plen; j++) {
        var player = players[j];
        if (player.energy <= 0) {
          continue;
        }
        if (CollisionUtil.isColliding(energy, player)) {
          energy.remove = true;
          player.energy += 1;
          player.y -= 4;
        }
      }
    };

    for (var i = energies.length - 1; i >= 0; i--) {
      var energy = energies[i];
      if (energy.remove) {
        energies.splice(i, 1);
      }
    }
  }

  return {
    add: add,
    remove: remove,
    getAll: getAll,
    emitEnergy: emitEnergy,
    update: update
  }
}());
