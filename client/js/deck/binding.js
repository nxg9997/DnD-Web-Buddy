

var app;

(function() {
    app = new Vue({
        el: '#app',
        data: {
            hw: 'hello vue!',
            title: 'DnD Buddy',
            allCards: [],
            links: [
                {
                    label: 'Card Builder',
                    href: './builder.html',
                },
                {
                    label: 'Stat Tracker',
                    href: './',
                },
                {
                    label: 'Deck Builder',
                    href: './deck.html',
                },
            ],
            deck: [],
            searchQuery: '',
            currRange: {
                start: 0,
                length: 6,
            },
            cardDisplay: [],
            optionsOpen: false,
            allDecks: [],
            deckName: 'deck',
        },
        methods: {
            loadCardByName: () => {
                fetch('/getCard', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:app.currentCard.name})}).then((res)=>{
                    res.json().then(data=>{
                        //console.log(data);
                        app.currentCard = data;
                        updateCard();
                    });
                });
            },
            searchForCard: () => {
                fetch('/getCard', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:app.searchQuery})}).then((res)=>{
                    res.json().then(data=>{
                        //console.log(data);
                        app.allCards = [data];
                        //updateCard();
                    });
                });
            },
            addToDeck: (name) => {
                //console.log(name);
                app.deck.push(name.name);
                app.deck.sort();
                drawCards('.deck-display');
            },
            removeFromDeck: (name) => {
                for(let i = 0; i < app.deck.length; i++){
                    if(app.deck[i] === name){
                        console.log('splicing ' + name)
                        app.deck.splice(i,1);
                        return;
                    }
                }
            },
            downloadDeck: () => {
                buildDeck();
            },
            moveDisplay: (start) => {
                updateDisplay(start);
                cardsDrawn = false;
                drawCards();
            },
            toggleOptions: () => {
                app.optionsOpen = !app.optionsOpen;
            },
            uploadDeck: () => {
                fetch('/deck', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:app.deckName,cards:app.deck})}).then((res)=>{
                    res.json().then(data=>{
                        //console.log(data);
                        app.getAllDecks();
                    });
                });
            },
            getAllDecks: (callback=null) => {
                fetch('/getDeck', {method:'GET'}).then(res=>{
                    res.json().then(data=>{
                        console.log(data);
                        app.allDecks = data;
                        if(callback !== null){
                            callback();
                        }
                    });
                });
            },
            loadDeck: (name) => {
                fetch('/getDeck', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:name})}).then((res)=>{
                    res.json().then(data=>{
                        //console.log(data);
                        //app.getAllDecks();
                        app.deckName = name;
                        app.deck = data.cards;
                    });
                });
            },
            deleteDeck: () => {
                fetch('/deleteDeck', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:app.deckName})}).then((res)=>{
                    res.json().then(data=>{
                        //console.log(data);
                        //app.getAllDecks();
                        app.getAllDecks();
                    });
                });
            },
        },
        watch: {
            
        },
        updated() {
            if(window.drawCards){
                //console.log('exists');
                drawCards();
            }
            drawCards('.deck-display',0.1);
        }
    });

    getAllCards(() => {
        updateDisplay();
        drawCards();
    });

    app.getAllDecks()
})();

function getAllCards(callback=null) {
    fetch('/getCard', {method:'GET'}).then(res=>{
        res.json().then(data=>{
            console.log(data);
            app.allCards = data;
            if(callback !== null){
                callback();
            }
        });
    });
}
