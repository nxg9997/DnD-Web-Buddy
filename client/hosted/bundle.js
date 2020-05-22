"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var app;

var Player = /*#__PURE__*/function () {
  function Player(name) {
    _classCallCheck(this, Player);

    this.name = name;
    this.hp = 200;
    this.atk = 5;
    this.def = 5;
    this.atkMult = 1;
    this.defMult = 1;
  }

  _createClass(Player, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.name, ",").concat(this.hp, ",").concat(this.atk, ",").concat(this.def, ",").concat(this.atkMult, ",").concat(this.defMult);
    }
  }]);

  return Player;
}();

(function () {
  console.log('hello world');

  if (window.location.pathname === '/') {//initSocket();
  }

  app = new Vue({
    el: '#app',
    data: {
      hw: 'hello vue!',
      title: 'DnD Buddy',
      links: [{
        label: 'Card Builder',
        href: './builder'
      }, {
        label: 'Stat Tracker',
        href: './'
      }],
      stats: {
        player1: new Player(''),
        player2: new Player('')
      }
    },
    methods: {
      emitChange: function emitChange() {
        socket.emit('stat update', app.stats.player1.toString() + "?" + app.stats.player2.toString());
      }
    },
    watch: {
      stats: function stats() {
        app.emitChange();
      }
    }
  });
})();
"use strict";

var socket = io();

function initSocket() {
  socket = io();
  console.log(socket);
}
