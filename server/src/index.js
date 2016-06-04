
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

setInterval(function(){
  // process user input
  InputManager.update();
  // apply physics such as gravity, acceleration, velocity, friction to objects
  PhysicsManager.update();
  // update any bullets in the game
  BulletManager.update();

  io.emit('players', PlayerManager.getAll().map(function(player) {
    return _.omit(player, 'socket');
  }));

  io.emit('bullets', BulletManager.getAll().map(function(bullet) {
    return _.omit(bullet, 'player');
  }));
}, 10);

// Setup the server & rest API
var port = process.env.PORT || 8081;

var router = express.Router();
server.listen(port);
