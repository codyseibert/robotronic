
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
var Player = require('./Player');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

io.on('connection', function(socket) {
  new SocketListener(socket);
  new EventListener(socket);
});

var TARGET_SLEEP_TIME = 10;

var then = new Date().getTime()
var update = function() {
  var now = new Date().getTime()
  var delta = now - then;

  var before = new Date().getTime();
  // process user input
  InputManager.update();
  // apply physics such as gravity, acceleration, velocity, friction to objects
  PhysicsManager.update();
  // update any bullets in the game
  BulletManager.update(delta);

  io.emit('players', PlayerManager.getAll().map(function(player) {
    return _.omit(player, 'socket');
  }));

  io.emit('bullets', BulletManager.getAll().map(function(bullet) {
    return _.omit(bullet, 'player');
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
