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
    this.atkMult = 0;
    this.defMult = 0;
    this.extraDmg = 0;
  }

  _createClass(Player, [{
    key: "toString",
    value: function toString() {
      return "".concat(this.name, ",").concat(this.hp, ",").concat(this.atk, ",").concat(this.def, ",").concat(this.atkMult, ",").concat(this.defMult, ",").concat(this.extraDmg);
    }
  }, {
    key: "fromArr",
    value: function fromArr(arr) {
      this.name = arr[0];
      console.log(this.name);
      this.hp = arr[1];
      this.atk = arr[2];
      this.def = arr[3];
      this.atkMult = arr[4];
      this.defMult = arr[5];
      this.extraDmg = arr[6];
    }
  }]);

  return Player;
}();

(function () {
  console.log('hello world');

  if (window.location.pathname === '/') {//initSocket();
  }

  var forms = document.querySelectorAll('form');

  for (var i = 0; i < forms.length; i++) {
    forms[i].onsubmit = function (e) {
      e.preventDefault();
    };
  }

  app = new Vue({
    el: '#app',
    data: {
      hw: 'hello vue!',
      title: 'DnD Buddy',
      allCards: [],
      links: [{
        label: 'Card Builder',
        href: './builder.html'
      }, {
        label: 'Stat Tracker',
        href: './'
      }, {
        label: 'Deck Builder',
        href: './deck.html'
      }],
      stats: {
        player1: new Player('Player 1'),
        player2: new Player('Player 2'),
        summon: new Player('Summon')
      },
      roomID: '',
      atkMult: 0.25,
      defMult: 0.25
    },
    methods: {
      emitChange: function emitChange() {
        socket.emit('stat update', app.stats.player1.toString() + "?" + app.stats.player2.toString());
      },
      attackFromP1: function attackFromP1() {
        attackV2(app.stats.player1, app.stats.player2);
      },
      attackFromP2: function attackFromP2() {
        attackV2(app.stats.player2, app.stats.player1);
      },
      changeRoom: function changeRoom() {
        socket.emit('room change', app.roomID);
      },
      summonAttack: function summonAttack(player) {
        attackV2(app.stats.summon, player);
      },
      attackSummon: function attackSummon(player) {
        attackV2(player, app.stats.summon);
      }
    },
    watch: {},
    updated: function updated() {}
  }); //getAllCards();
})();
"use strict";

var socket = io();
socket.on('stat update', function (msg) {
  console.log(msg);
  updateStats(msg);
});

function updateStats(str) {
  var split = str.split('?');

  for (var i = 0; i < split.length; i++) {
    var ps = split[i].split(',');
    if (i === 0) app.stats.player1.fromArr(ps);
    if (i === 1) app.stats.player2.fromArr(ps);
  }
} // - p1 attacks p2


function attack(p1, p2) {
  console.log("attack!");
  var dmg = parseInt(p1.atk) * (parseFloat(p1.atkMult) * 0.25 + 1) + parseInt(p1.extraDmg) - parseInt(p2.def) * (parseFloat(p2.defMult) * 0.25 + 1);
  if (dmg < 0) dmg = 0;
  p2.hp = Math.round(parseFloat(p2.hp) - dmg);
  app.emitChange();
}

function attackV2(p1, p2) {
  // dmg = (((2 * L / 5 + 2) * P * A / D) / 50 + 2) * modifier
  var L = 1; // level

  var aM = 1 + 0.5 * parseFloat(p1.atkMult);
  var dM = 1 + 0.5 * parseFloat(p2.defMult);
  var dmg = parseFloat(p1.extraDmg) * parseFloat(p1.atk) * aM / parseFloat(p2.def) * dM / 1 + 2;
  if (dmg < 0) dmg = 0;
  p2.hp = Math.round(parseFloat(p2.hp) - dmg);
  app.emitChange();
}
