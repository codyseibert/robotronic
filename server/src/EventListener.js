var Player = require('./Player');
var PlayerManager = require('./PlayerManager');
var MapManager = require('./MapManager');
var _ = require('lodash');

module.exports = function(socket) {
  var player = null;

  socket.on('join', function(payload) {
    player = new Player();
    player.name = payload.name;
    player.socket = socket;

    // find blank space on map
    var blankLoc = MapManager.findBlankTile();
    player.x = blankLoc.x - 30;
    player.y = blankLoc.y - 30;

    PlayerManager.add(player);

    socket.emit('players', PlayerManager.getAll().map(function(player) {
      return _.omit(player, 'socket');
    }));
    socket.emit('map', MapManager.getCurrentMap());
    socket.emit('id', player.id);
  });

  socket.on('leave', function() {
    player = null;
    PlayerManager.remove(player);
  });

  socket.on('input', function(input) {
    player.input = input
  });
};
