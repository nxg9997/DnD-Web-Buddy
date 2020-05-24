"use strict";

var canvas;
var ctx;

(function () {
  window.onload = function () {
    canvas = document.querySelector('#cardCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = 409;
    canvas.height = 585;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 409, 585);
    updateCard();
  };
})();

function updateCard() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 409, 585);
  ctx.font = "20px Arial";
  ctx.fillStyle = 'black';
  ctx.textAlign = "center"; // - type

  ctx.fillText(app.currentCard.type, canvas.width / 2, 20); // - name

  ctx.font = "50px Arial";
  ctx.fillText(app.currentCard.name, canvas.width / 2, 100); // - top text

  var split = createMultiline(app.currentCard.topText); //app.currentCard.topText.match(/.{1,30}/g);

  ctx.font = "20px Arial";

  for (var i = 0; i < split.length; i++) {
    ctx.fillText(split[i], canvas.width / 2, 250 + i * 20);
  } // - bottom text


  split = createMultiline(app.currentCard.bottomText);
  ctx.font = "20px Arial";

  for (var _i = 0; _i < split.length; _i++) {
    ctx.fillText(split[_i], canvas.width / 2, 450 + _i * 20);
  }
}

function createMultiline(str) {
  var arr = [];
  var split1 = str.split('|');

  for (var i = 0; i < split1.length; i++) {
    var split2 = split1[i].match(/.{1,30}/g);

    for (var j = 0; j < split2.length; j++) {
      arr.push(split2[j]);
    }
  }

  return arr;
}
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
      }],
      currentCard: {
        name: 'Name',
        type: 'Type',
        topText: 'Top Text',
        bottomText: 'Bottom Text'
      },
      user: 'unknown',
      dlbtnHref: '/builder.html',
      stats: {
        player1: new Player('Player 1'),
        player2: new Player('Player 2')
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
        attack(app.stats.player1, app.stats.player2);
      },
      attackFromP2: function attackFromP2() {
        attack(app.stats.player2, app.stats.player1);
      },
      changeRoom: function changeRoom() {
        socket.emit('room change', app.roomID);
      },
      updateCard: function (_updateCard) {
        function updateCard() {
          return _updateCard.apply(this, arguments);
        }

        updateCard.toString = function () {
          return _updateCard.toString();
        };

        return updateCard;
      }(function () {
        updateCard(); //app.downloadCard();
      }),
      downloadCard: function downloadCard() {
        var img = canvas.toDataURL('image/jpg'); //window.location.href = img;
        //window.location

        var link = document.createElement('a');
        link.download = "".concat(app.currentCard.name, ".jpg");
        link.href = img;
        link.click();
      },
      saveCardtoDB: function saveCardtoDB() {
        var newCard = {
          name: app.currentCard.name,
          type: app.currentCard.type,
          topText: app.currentCard.topText,
          bottomText: app.currentCard.bottomText,
          user: app.user
        };
        console.log(newCard);
        fetch('/card', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newCard)
        }).then(function (res) {
          res.json().then(function (data) {
            console.log(data);
            getAllCards();
          });
        });
      },
      loadCardByName: function loadCardByName() {
        fetch('/getCard', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: app.currentCard.name
          })
        }).then(function (res) {
          res.json().then(function (data) {
            console.log(data);
            app.currentCard = data;
            updateCard();
          });
        });
      },
      loadCardByClick: function loadCardByClick(name) {
        app.currentCard.name = name;
        app.loadCardByName();
      },
      deleteCard: function deleteCard() {
        fetch('/deleteCard', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: app.currentCard.name
          })
        }).then(function (res) {
          res.json().then(function (data) {
            console.log(data);
            getAllCards();
          });
        });
      }
    },
    watch: {
      stats: function stats() {
        app.emitChange();
      }
    }
  });
  getAllCards();
})();

function getAllCards() {
  fetch('/getCard', {
    method: 'GET'
  }).then(function (res) {
    res.json().then(function (data) {
      console.log(data);
      app.allCards = data;
    });
  });
}
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
