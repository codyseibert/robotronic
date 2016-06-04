var Player = require('./Player');
var PlayerManager = require('./PlayerManager');
var MapManager = require('./MapManager');
var _ = require('lodash');

module.exports = function(socket) {
  var player = null

  socket.on('join', function(payload) {
    console.log('player joined', socket.id, payload);
    player = new Player()
    player.name = payload.name;
    player.socket = socket;

    // find blank space on map
    var blankLoc = MapManager.findBlankSpace();
    console.log(blankLoc);
    player.x = blankLoc.x * 64 + 32;
    player.y = blankLoc.y * 64 + 32;

    PlayerManager.add(socket, player);

    socket.emit('players', PlayerManager.getAll().map(function(player) {
      return _.omit(player, 'socket');
    }));
    socket.emit('map', MapManager.getCurrentMap());
    socket.emit('id', player.id);
  });

  socket.on('leave', function() {
    console.log('player leave', socket.id);
    player = null;
    PlayerManager.remove(socket);
  });

  socket.on('input', function(input) {
    player.input = input
  });
};
