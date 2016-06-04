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

  function spawnEnergy() {
    if (energies.length > MAX_ENERGY) {
      return;
    }
    var blankTile = MapManager.findBlankTile();
    var energy = new Energy();
    energy.x = blankTile.x;
    energy.y = blankTile.y;
    energies.push(energy);
  }

  setInterval(spawnEnergy, SPAWN_INTERVAL);

  function update(delta) {

    energies.map(function(energy) {
      var players = PlayerManager.getAll();
      for (var i = players.length - 1; i >= 0; i--) {
        var player = players[i];
        if (CollisionUtil.isColliding(energy, player)) {
          energy.remove = true;
          player.energy += 1;
        }
      }
    });

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
    update: update
  }
}());
