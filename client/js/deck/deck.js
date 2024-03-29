var cardsDrawn = false;

function drawCards(src='.card-display',scale=0.35) {
    //if(cardsDrawn) return;

    cardsDrawn = true;
    let canvases = document.querySelectorAll(src);
    //console.log(canvases);
    for(let i = 0; i < canvases.length; i++){
        //console.log(canvases[i].innerHTML);
        fetch('/getCard', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:canvases[i].innerHTML})}).then((res)=>{
            res.json().then(data=>{
                //console.log(data);
                //app.currentCard = data;
                updateCard(canvases[i], canvases[i].getContext('2d'),data,scale);
            });
        });
        //updateCard(canvases[i], canvases[i].getContext('2d'),)
    }
}

function findInAllCards(name) {
    for(let i = 0; i < app.allCards.length; i++){
        if(app.allCards[i].name === name){
            return app.allCards[i];
        }
    }
}

function buildDeck() {
    let finishCount = 0;
    let zip = new JSZip();
    let deck = minimizeDeck();
    for(let i = 0; i < deck.length; i++){
        let cardCanvas = document.createElement('canvas');
        cardCanvas.width = 409;
        cardCanvas.height = 585;
        fetch('/getCard', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:deck[i].name})}).then((res)=>{
            res.json().then(data=>{
                console.log(data);
                //app.currentCard = data;
                updateCard(cardCanvas, cardCanvas.getContext('2d'),data,1.0, () => {
                    let img = cardCanvas.toDataURL('image/jpg');
                    let imgEl = new Image();
                    imgEl.src = img;
                    let blob = null;
                    cardCanvas.toBlob(result=>{
                        zip.file(buildFileName(deck[i].count, deck[i].name), result, {base64: true});
                        finishCount++;
    
                        if(finishCount >= deck.length){
                            createBack((backblob)=>{
                                zip.file(`00 Back.jpg`, backblob, {base64: true});
                                zip.generateAsync({type:"blob"}).then(content=>{
                                    saveAs(content, `${app.deckName}.zip`);
                                });
                            });
                            
                        }
                    },"image/jpg", 0.75);
                });
                //console.log(cardCanvas);
                
                
            });
        });
        
    }
}

function minimizeDeck() {
    let deck = [];
    let count = [];

    for(let i = 0; i < app.deck.length; i++){
        if(!deck.includes(app.deck[i])){
            deck.push(app.deck[i]);
            count.push(1);
        }
        else{
            let ind = deck.indexOf(app.deck[i]);
            count[ind]++;
        }
    }

    let final = [];
    for(let i = 0; i < deck.length; i++){
        final.push({
            name: deck[i],
            count: count[i],
        });
    }
    console.log(final);
    return final;
}

function createBack(callback) {
    let backCanvas = document.createElement('canvas');
    let backCtx = backCanvas.getContext('2d');

    backCanvas.width = 409;
    backCanvas.height = 585;

    backCtx.fillStyle = 'black';
    backCtx.fillRect(0,0,409,585);

    backCtx.strokeStyle = 'red';
    backCtx.lineWidth = 20;
    backCtx.strokeRect(0,0,409,585);

    backCanvas.toBlob(blob=>{
        callback(blob);
    },"image/jpg", 0.75);
}

function buildFileName(num,name){
    let str = `${num}`;
    if(str.length < 2){
        str = '0' + str;
    }

    return str + "x " + name + '.jpg';
}

function updateDisplay(start=0,length=8) {
    app.currRange.start = start;
    app.currRange.length = length;

    app.cardDisplay = [];

    for(let i = start; i < start + length; i++){
        if(i >= app.allCards.length) break;

        app.cardDisplay.push(app.allCards[i]);
    }
}