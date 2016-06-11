var io = require('socket.io-client');
var _ = require('lodash');
var $ = require('jquery');

var MapManager = require('./MapManager');
var PlayerManager = require('./PlayerManager');
var CameraManager = require('./CameraManager');
var BulletManager = require('./BulletManager');
var EnergyManager = require('./EnergyManager');

window.DEBUG = true;

$(document).ready(function(){
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext("2d");

  $(window).resize(function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    $('#udead').css('left', canvas.width / 2 - 100 + "px");
    $('#udead').css('top', canvas.height / 2 - 100 + "px");
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

  $(document).mousemove(function(evt) {
    var centerX = canvas.width / 2 + 24;
    var centerY = canvas.height / 2 + 24;
    var mouseX = evt.clientX;
    var mouseY = evt.clientY;
    var angle = Math.atan2(mouseY - centerY, mouseX - centerX);
    input.angle = angle;
    socket.emit('input', input);
  });

  $(document).mousedown(function(evt) {
    input.fire = true;
    socket.emit('input', input);
  });

  $(document).mouseup(function(evt) {
    input.fire = false;
    socket.emit('input', input);
  });

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

  var socket = io.connect('http://' + window.location.hostname + ':8081');
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
    var myPlayer = _.find(p, {id: playerId});
    CameraManager.setTarget(myPlayer);
    if (myPlayer) {
      $('#energy .count').text(myPlayer.energy || 0);

      if (myPlayer.energy <= 0) {
        $('#udead').show();
      } else {
        $('#udead').hide();
      }
    }
    PlayerManager.setPlayers(p);


    p.sort(function(a, b) {
      return b.energy - a.energy;
    });
    $('#scoreboard .players').empty();
    var i = 1;
    p.forEach(function(play) {
      var $row = $('<tr></tr>');
      var $rank = $('<td></td>').html(i++);
      var $name = $('<td></td>').html(play.name);
      var $energy = $('<td></td>').html(play.energy);
      $row.append($rank);
      $row.append($name);
      $row.append($energy);
      $('#scoreboard .players').append($row);
    });
  });

  socket.on('bullets', function(b) {
    BulletManager.setBullets(b);
  });

  socket.on('energies', function(e) {
    EnergyManager.setEnergies(e);
  });

  function update() {
    CameraManager.update();
  }

  setInterval(update, 10);

  var lastTime;
  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // update based on time passed, not render speed
    var now = Date.now();
    var dt = (now - (lastTime || now)) / 1000.0;

    PlayerManager.update(dt);

    MapManager.render(context);
    PlayerManager.render(context);
    BulletManager.render(context);
    EnergyManager.render(context);

    lastTime = now;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
});
