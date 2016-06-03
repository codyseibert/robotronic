var _ = require('lodash');

module.exports = (function() {
  var players = {}

  function add(socket, player) {
    players[socket.id] = player;
  }

  function remove(socket) {
    delete players[socket.id];
  }

  function get(socket) {
    return players[socket.id]
  }

  function getAll() {
    return Object.keys(players).map(function(key) {
      return players[key]
    });
  }

  return {
    add: add,
    remove: remove,
    get: get,
    getAll: getAll
  }
}());
