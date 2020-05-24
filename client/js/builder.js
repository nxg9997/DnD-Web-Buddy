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

function updateCard() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,409,585);
    ctx.font = "20px Arial";

    ctx.fillStyle = 'black';
    ctx.textAlign = "center";

    // - type
    ctx.fillText(app.currentCard.type, canvas.width / 2, 20);

    // - name
    ctx.font = "50px Arial";
    ctx.fillText(app.currentCard.name, canvas.width / 2, 100);

    // - top text
    let split = createMultiline(app.currentCard.topText);//app.currentCard.topText.match(/.{1,30}/g);

    ctx.font = "20px Arial";
    for(let i = 0; i < split.length; i++)
        ctx.fillText(split[i], canvas.width / 2, 250 + (i * 20));

    // - bottom text
    split = createMultiline(app.currentCard.bottomText);

    ctx.font = "20px Arial";
    for(let i = 0; i < split.length; i++)
        ctx.fillText(split[i], canvas.width / 2, 450 + (i * 20));
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