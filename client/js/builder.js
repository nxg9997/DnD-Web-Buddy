var canvas;
var ctx;

(function(){
    window.onload = () => {
        canvas = document.querySelector('#cardCanvas');
        ctx = canvas.getContext('2d');
    
        canvas.width = 409;
        canvas.height = 585;
    
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,409,585);
        updateCard();
    };
    
})();

function updateCard(_canvas=null, _ctx=null, card=null, scale=1.0) {
    if(_canvas === null) _canvas = canvas;
    if(_ctx === null) _ctx = ctx;
    if(card === null) card = app.currentCard;

    _canvas.width = 409 * scale;
    _canvas.height = 585 * scale;

    _ctx.fillStyle = 'white';
    _ctx.fillRect(0,0,409 * scale,585 * scale);
    _ctx.font = `${20 * scale}px Arial`;

    _ctx.fillStyle = 'black';
    _ctx.textAlign = "center";

    // - type
    _ctx.fillText(card.type, _canvas.width / 2, 20 * scale);

    // - name
    _ctx.font = `${50 * scale}px Arial`;
    _ctx.fillText(card.name, _canvas.width / 2, 100 * scale);

    // - top text
    let split = createMultiline(card.topText);//card.topText.match(/.{1,30}/g);

    _ctx.font = `${20 * scale}px Arial`;
    for(let i = 0; i < split.length; i++)
        _ctx.fillText(split[i], _canvas.width / 2, 250 * scale + (i * 20 * scale));

    // - bottom text
    split = createMultiline(card.bottomText);

    _ctx.font = `${20 * scale}px Arial`;
    for(let i = 0; i < split.length; i++)
        _ctx.fillText(split[i], _canvas.width / 2, 450 * scale + (i * 20 * scale));
}

function createMultiline(str) {
    let arr = [];

    let split1 = str.split('|');
    for(let i = 0; i < split1.length; i++){
        let split2 = split1[i].match(/.{1,30}/g);
        for(let j = 0; j < split2.length; j++){
            arr.push(split2[j]);
        }
    }

    return arr;
}