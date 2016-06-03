var io = require('socket.io-client');
var _ = require('lodash');
var $ = require('jquery');

var MapManager = require('./MapManager');
var PlayerManager = require('./PlayerManager');
var CameraManager = require('./CameraManager');

$(document).ready(function(){
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext("2d");
  $(window).resize(function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  $(window).resize();

  var playerId = null;

  var A = 97;
  var D = 100;
  var SPACE = 32;

  var keyMap = {
    65: 'left',
    68: 'right',
    32: 'jump'
  };

  var input = {};

  $(document).keydown(function(evt) {
    var key = evt.keyCode || evt.which;
    input[keyMap[key]] = true;
    socket.emit('input', input);
  });

  $(document).keyup(function(evt) {
    var key = evt.keyCode || evt.which;
    input[keyMap[key]] = false;
    socket.emit('input', input);
  });

  var socket = io.connect('http://localhost:8081');
  socket.on('connect', function(data) {
    socket.emit('join', {name: 'FiVeTeN'});
  });

  socket.on('map', function(m) {
    MapManager.setMap(m);
  });

  socket.on('id', function(i) {
    playerId = i;
  });

  socket.on('players', function(p) {
    CameraManager.setTarget(_.find(p, {id: playerId}));
    PlayerManager.setPlayers(p);
  });

  function update() {
    CameraManager.update()
  }

  setInterval(function() {
    update()
  , 10});

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    PlayerManager.render(context);
    MapManager.render(context);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
});
