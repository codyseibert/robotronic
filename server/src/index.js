
require('dotenv').config();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var _ = require('lodash');

var InputManager = require('./InputManager');
var PlayerManager = require('./PlayerManager');
var PhysicsManager = require('./PhysicsManager');
var BulletManager = require('./BulletManager');
var MapManager = require('./MapManager');
var SocketListener = require('./SocketListener');
var EventListener = require('./EventListener');
var EnergyManager = require('./EnergyManager');
var AIManager = require('./AIManager');
var Player = require('./Player');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

io.on('connection', function(socket) {
  new SocketListener(socket);
  new EventListener(socket);
});

var TARGET_SLEEP_TIME = 10;
var MAX_AI = 10;

for (var i = 0; i < MAX_AI; i++){
  var ai = new Player();
  ai.name = "AI " + i;
  var blankLoc = MapManager.findBlankTile();
  ai.x = blankLoc.x - 30;
  ai.y = blankLoc.y - 30;
  PlayerManager.add(ai);
  AIManager.add(ai);
}

var then = new Date().getTime()
var update = function() {
  var now = new Date().getTime()
  var delta = now - then;

  var before = new Date().getTime();

  InputManager.update(delta);
  PhysicsManager.update(delta);
  BulletManager.update(delta);
  EnergyManager.update(delta);
  PlayerManager.update(delta);
  AIManager.update(delta);

  io.emit('players', PlayerManager.getAll().map(function(player) {
    return _.omit(player, 'socket');
  }));

  io.emit('bullets', BulletManager.getAll().map(function(bullet) {
    return _.omit(bullet, 'player');
  }));

  io.emit('energies', EnergyManager.getAll().map(function(energy) {
    return energy;
  }));

  var after = new Date().getTime();
  var time = after - before;
  var sleepTime = Math.max(0, TARGET_SLEEP_TIME - time);
  then = now;
  setTimeout(update, sleepTime);
}
update();

// Setup the server & rest API
var port = process.env.PORT || 8081;

var router = express.Router();
server.listen(port);
