var canvas;
var ctx;

(function(){
    window.onload = () => {
        canvas = document.querySelector('#cardCanvas');
        if(canvas === null) return;

        ctx = canvas.getContext('2d');
    
        canvas.width = 409;
        canvas.height = 585;
    
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,409,585);
        updateCard();
    };
    
})();

function updateCard(_canvas=null, _ctx=null, card=null, scale=1.0, callback=null) {
    if(_canvas === null) _canvas = canvas;
    if(_ctx === null) _ctx = ctx;
    if(card === null) card = app.currentCard;
    //console.log("im being drawn i think");
    _canvas.width = 409 * scale;
    _canvas.height = 585 * scale;

    _ctx.fillStyle = 'white';
    _ctx.fillRect(0,0,409 * scale,585 * scale);

    let art = new Image();

    art.crossOrigin = 'anonymous';
    
    if(card.art === '')
        art.src = '/hosted/img/white.jpg';
    else if(card.art[0] !== '/')
        art.src = '/art?src=' + card.art;
    else
        art.src = card.art;

    art.addEventListener('load', () => {
        let widthRatio = 1.0;
        if(art.width > 409){
            widthRatio = 409 / art.width;
        }
        _ctx.drawImage(art,0,100 * scale,art.width * widthRatio * scale, art.height * widthRatio * scale);

        let bg = new Image();
        switch(card.style){
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
        
        bg.addEventListener('load', () => {
            //console.log('loaded');
            _ctx.drawImage(bg,0,0,409 * scale, 585 * scale);
            _ctx.font = `${20 * scale}px Arial`;
        
            _ctx.fillStyle = 'black';
            _ctx.textAlign = "center";
        
            // - type
            if(card.type !== null)
                _ctx.fillText(card.type, _canvas.width / 6, 60 * scale);
        
            // - name
            _ctx.font = `${50 * scale}px Arial`;
            if(card.name !== null)
                _ctx.fillText(card.name, _canvas.width / 2, 70 * scale);

            // - value
            if(card.style === 'Attack'){
                _ctx.font = `${40 * scale}px Arial`;
                _ctx.fillText(card.value, _canvas.width / 2, 325 * scale);
            }
            else if(card.style === 'Object'){
                _ctx.font = `${40 * scale}px Arial`;
                _ctx.fillText(card.value, 55 * scale, 540 * scale);
            }
        
            // - top text
            let yOffset = 0;
            if(card.style === 'Attack'){
                yOffset = 100;
            }
            let split = createMultiline(card.topText);//card.topText.match(/.{1,30}/g);
        
            _ctx.font = `${20 * scale}px Arial`;
            if(split !== null){
                for(let i = 0; i < split.length; i++)
                    _ctx.fillText(split[i], _canvas.width / 2, (315 + yOffset) * scale + (i * 20 * scale));
            }
            
        
            // - bottom text
            split = createMultiline(card.bottomText);
        
            _ctx.font = `${20 * scale}px Arial`;
            if(split !== null){
                for(let i = 0; i < split.length; i++)
                    _ctx.fillText(split[i], _canvas.width / 2, (450 + yOffset/2) * scale + (i * 20 * scale));
            }

            if(card.evolves){
                let evo = new Image();
                evo.src = '/hosted/img/evolve_temp.png';
                evo.addEventListener('load', () => {
                    _ctx.drawImage(evo, (409 - 75) * scale, (585 - 75) * scale, evo.width * scale / 2, evo.height * scale / 2);
                    if(callback) callback();
                });
            }
            else{
                if(callback) callback();
            }

            // - Mana
            _ctx.fillText("Mana: " + card.mana, 300 * scale, 90 * scale);
        });
    });
    art.addEventListener('error',(err)=>{
        console.log(err);
        var snackbarContainer = document.querySelector('#snackbar');
        var data = {
            message: 'Art Source doesn\'t allow Cross-Origin',
            timeout: 6000,
            actionHandler: ()=>{},
            actionText: 'Undo',
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    });
    
    
}

function createMultiline(str) {
    let arr = [];

    let split1 = str.split('|');
    for(let i = 0; i < split1.length; i++){
        let split2 = split1[i].match(/.{1,30}/g);
        if(split2 !== null){
            for(let j = 0; j < split2.length; j++){
                arr.push(split2[j]);
            }
        }
        
    }

    return arr;
}