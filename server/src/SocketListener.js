var PlayerManager = require('./PlayerManager');

module.exports = function(socket) {

  socket.on('disconnect', function() {
    console.log('player disconnected', socket.id);
    PlayerManager.remove(socket);
  });

};
