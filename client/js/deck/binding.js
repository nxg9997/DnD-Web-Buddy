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
        },
        watch: {
            
        },
        updated() {
            if(window.drawCards){
                //console.log('exists');
                drawCards();
            }
        }
    });

    getAllCards();
})();

function getAllCards() {
    fetch('/getCard', {method:'GET'}).then(res=>{
        res.json().then(data=>{
            console.log(data);
            app.allCards = data;
        });
    });
}
