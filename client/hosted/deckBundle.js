"use strict";

var app;

(function () {
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
      deck: [],
      searchQuery: ''
    },
    methods: {
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
            //console.log(data);
            app.currentCard = data;
            updateCard();
          });
        });
      },
      searchForCard: function searchForCard() {
        fetch('/getCard', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: app.searchQuery
          })
        }).then(function (res) {
          res.json().then(function (data) {
            //console.log(data);
            app.allCards = [data]; //updateCard();
          });
        });
      },
      addToDeck: function addToDeck(name) {
        //console.log(name);
        app.deck.push(name.name);
        app.deck.sort();
      },
      removeFromDeck: function removeFromDeck(name) {
        for (var i = 0; i < app.deck.length; i++) {
          if (app.deck[i] === name) {
            console.log('splicing ' + name);
            app.deck.splice(i, 1);
            return;
          }
        }
      },
      downloadDeck: function downloadDeck() {
        buildDeck();
      }
    },
    watch: {},
    updated: function updated() {
      if (window.drawCards) {
        //console.log('exists');
        drawCards();
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

var cardsDrawn = false;

function drawCards() {
  if (cardsDrawn) return;
  cardsDrawn = true;
  var canvases = document.querySelectorAll('canvas'); //console.log(canvases);

  var _loop = function _loop(i) {
    //console.log(canvases[i].innerHTML);
    fetch('/getCard', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: canvases[i].innerHTML
      })
    }).then(function (res) {
      res.json().then(function (data) {
        //console.log(data);
        //app.currentCard = data;
        updateCard(canvases[i], canvases[i].getContext('2d'), data, 0.35);
      });
    }); //updateCard(canvases[i], canvases[i].getContext('2d'),)
  };

  for (var i = 0; i < canvases.length; i++) {
    _loop(i);
  }
}

function buildDeck() {
  var finishCount = 0;
  var zip = new JSZip();
  var deck = minimizeDeck();

  var _loop2 = function _loop2(i) {
    var cardCanvas = document.createElement('canvas');
    cardCanvas.width = 409;
    cardCanvas.height = 585;
    fetch('/getCard', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: deck[i].name
      })
    }).then(function (res) {
      res.json().then(function (data) {
        console.log(data); //app.currentCard = data;

        updateCard(cardCanvas, cardCanvas.getContext('2d'), data, 1.0, function () {
          var img = cardCanvas.toDataURL('image/jpg');
          var imgEl = new Image();
          imgEl.src = img;
          var blob = null;
          cardCanvas.toBlob(function (result) {
            zip.file(buildFileName(deck[i].count, deck[i].name), result, {
              base64: true
            });
            finishCount++;

            if (finishCount >= deck.length) {
              createBack(function (backblob) {
                zip.file("00 Back.jpg", backblob, {
                  base64: true
                });
                zip.generateAsync({
                  type: "blob"
                }).then(function (content) {
                  saveAs(content, "deck.zip");
                });
              });
            }
          }, "image/jpg", 0.75);
        }); //console.log(cardCanvas);
      });
    });
  };

  for (var i = 0; i < deck.length; i++) {
    _loop2(i);
  }
}

function minimizeDeck() {
  var deck = [];
  var count = [];

  for (var i = 0; i < app.deck.length; i++) {
    if (!deck.includes(app.deck[i])) {
      deck.push(app.deck[i]);
      count.push(1);
    } else {
      var ind = deck.indexOf(app.deck[i]);
      count[ind]++;
    }
  }

  var _final = [];

  for (var _i = 0; _i < deck.length; _i++) {
    _final.push({
      name: deck[_i],
      count: count[_i]
    });
  }

  console.log(_final);
  return _final;
}

function createBack(callback) {
  var backCanvas = document.createElement('canvas');
  var backCtx = backCanvas.getContext('2d');
  backCanvas.width = 409;
  backCanvas.height = 585;
  backCtx.fillStyle = 'black';
  backCtx.fillRect(0, 0, 409, 585);
  backCtx.strokeStyle = 'red';
  backCtx.lineWidth = 20;
  backCtx.strokeRect(0, 0, 409, 585);
  backCanvas.toBlob(function (blob) {
    callback(blob);
  }, "image/jpg", 0.75);
}

function buildFileName(num, name) {
  var str = "".concat(num);

  if (str.length < 2) {
    str = '0' + str;
  }

  return str + "x " + name + '.jpg';
}
"use strict";

var canvas;
var ctx;

(function () {
  window.onload = function () {
    canvas = document.querySelector('#cardCanvas');
    if (canvas === null) return;
    ctx = canvas.getContext('2d');
    canvas.width = 409;
    canvas.height = 585;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 409, 585);
    updateCard();
  };
})();

function updateCard() {
  var _canvas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var _ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var card = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
  var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  if (_canvas === null) _canvas = canvas;
  if (_ctx === null) _ctx = ctx;
  if (card === null) card = app.currentCard;
  _canvas.width = 409 * scale;
  _canvas.height = 585 * scale;
  _ctx.fillStyle = 'white';

  _ctx.fillRect(0, 0, 409 * scale, 585 * scale);

  var art = new Image();
  art.crossOrigin = 'anonymous';
  if (card.art === '') art.src = '/hosted/img/white.jpg';else if (card.art[0] !== '/') art.src = '/art?src=' + card.art;else art.src = card.art;
  art.addEventListener('load', function () {
    var widthRatio = 1.0;

    if (art.width > 409) {
      widthRatio = 409 / art.width;
    }

    _ctx.drawImage(art, 0, 100 * scale, art.width * widthRatio * scale, art.height * widthRatio * scale);

    var bg = new Image();

    switch (card.style) {
      case 'Field':
        bg.src = '/hosted/img/FieldCardBase.png';
        break;

      case 'Attack':
        bg.src = '/hosted/img/AttackCardBase.png';
        break;

      case 'Object':
        bg.src = '/hosted/img/ObjectCardBase.png';
        break;

      case 'Reaction':
        bg.src = '/hosted/img/ReactionCardBase.png';
        break;

      case 'Spell':
        bg.src = '/hosted/img/SpellCardBase.png';
        break;

      default:
        bg.src = '/hosted/img/FieldCardBase.png';
        break;
    }

    bg.addEventListener('load', function () {
      //console.log('loaded');
      _ctx.drawImage(bg, 0, 0, 409 * scale, 585 * scale);

      _ctx.font = "".concat(20 * scale, "px Arial");
      _ctx.fillStyle = 'black';
      _ctx.textAlign = "center"; // - type

      if (card.type !== null) _ctx.fillText(card.type, _canvas.width / 6, 60 * scale); // - name

      _ctx.font = "".concat(50 * scale, "px Arial");
      if (card.name !== null) _ctx.fillText(card.name, _canvas.width / 2, 70 * scale); // - value

      if (card.style === 'Attack') {
        _ctx.font = "".concat(40 * scale, "px Arial");

        _ctx.fillText(card.value, _canvas.width / 2, 325 * scale);
      } else if (card.style === 'Object') {
        _ctx.font = "".concat(40 * scale, "px Arial");

        _ctx.fillText(card.value, 55 * scale, 540 * scale);
      } // - top text


      var yOffset = 0;

      if (card.style === 'Attack') {
        yOffset = 100;
      }

      var split = createMultiline(card.topText); //card.topText.match(/.{1,30}/g);

      _ctx.font = "".concat(20 * scale, "px Arial");

      if (split !== null) {
        for (var i = 0; i < split.length; i++) {
          _ctx.fillText(split[i], _canvas.width / 2, (315 + yOffset) * scale + i * 20 * scale);
        }
      } // - bottom text


      split = createMultiline(card.bottomText);
      _ctx.font = "".concat(20 * scale, "px Arial");

      if (split !== null) {
        for (var _i = 0; _i < split.length; _i++) {
          _ctx.fillText(split[_i], _canvas.width / 2, (450 + yOffset / 2) * scale + _i * 20 * scale);
        }
      }

      if (card.evolves) {
        var evo = new Image();
        evo.src = '/hosted/img/evolve_temp.png';
        evo.addEventListener('load', function () {
          _ctx.drawImage(evo, (409 - 75) * scale, (585 - 75) * scale, evo.width * scale / 2, evo.height * scale / 2);

          if (callback) callback();
        });
      } else {
        if (callback) callback();
      }
    });
  });
  art.addEventListener('error', function (err) {
    console.log(err);
    var snackbarContainer = document.querySelector('#snackbar');
    var data = {
      message: 'Art Source doesn\'t allow Cross-Origin',
      timeout: 6000,
      actionHandler: function actionHandler() {},
      actionText: 'Undo'
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  });
}

function createMultiline(str) {
  var arr = [];
  var split1 = str.split('|');

  for (var i = 0; i < split1.length; i++) {
    var split2 = split1[i].match(/.{1,30}/g);

    if (split2 !== null) {
      for (var j = 0; j < split2.length; j++) {
        arr.push(split2[j]);
      }
    }
  }

  return arr;
}
