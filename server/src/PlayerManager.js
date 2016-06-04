var _ = require('lodash');
var MapManager = require('./MapManager');

var RESPAWN_TIME = 5000;

module.exports = (function() {
  var playerMap = {}
  var players = []

  function add(socket, player) {
    playerMap[socket.id] = player;
    players.push(player);
  }

  function remove(socket) {
    var player = playerMap[socket.id];
    delete playerMap[socket.id];
    players.splice(players.indexOf(player), 1);
  }

  function get(socket) {
    return playerMap[socket.id]
  }

  function getAll() {
    return players;
  }

  function respawn(player) {
    player.health = 10;
    player.energy = 0;
    player.respawning = null;

    var blankLoc = MapManager.findBlankTile();
    player.x = blankLoc.x - 30;
    player.y = blankLoc.y - 30;
  }

  function update(delta) {
    players.map(function(player) {
      if (player.health <= 0 && !player.respawning) {
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
    get: get,
    getAll: getAll,
    update: update
  }
}());
