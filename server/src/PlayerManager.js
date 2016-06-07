var _ = require('lodash');
var MapManager = require('./MapManager');

var RESPAWN_TIME = 5000;

module.exports = (function() {
  var players = []

  function add(player) {
    players.push(player);
  }

  function remove(player) {
    players.splice(players.indexOf(player), 1);
  }

  function getAll() {
    return players;
  }

  function respawn(player) {
    player.energy = 3;
    player.respawning = null;

    var blankLoc = MapManager.findBlankTile();
    player.x = blankLoc.x - 30;
    player.y = blankLoc.y - 30;
  }

  function update(delta) {
    players.map(function(player) {
      if (player.energy <= 0 && !player.respawning) {
        player.respawning = true;
        setTimeout(function(){
          respawn(player);
        }, RESPAWN_TIME);
      }
    });
  }

  return {
    add: add,
    remove: remove,
    getAll: getAll,
    update: update
  }
}());
