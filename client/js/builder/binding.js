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
            currentCard: {
                name: 'Name',
                type: 'Type',
                topText: 'Top Text',
                bottomText: 'Bottom Text',
                art: '/hosted/img/white.jpg',
                style: 'Field',
                value: '0',
                evolves: false,
            },
            user: 'unknown',
            dlbtnHref: '/builder.html',
            roomID: '',
            searchQuery: '',
        },
        methods: {
            updateCard: () => {
                updateCard();
                //app.downloadCard();
            },
            downloadCard: () => {
                let img = canvas.toDataURL('image/jpg');
                //window.location.href = img;
                //window.location
                let link = document.createElement('a');
                link.download = `${app.currentCard.name}.jpg`;
                link.href = img;
                link.click();
            },
            saveCardtoDB: () => {
                let newCard = {
                    name: app.currentCard.name,
                    type: app.currentCard.type,
                    topText: app.currentCard.topText,
                    bottomText: app.currentCard.bottomText,
                    user: app.user,
                    art: app.currentCard.art,
                    style: app.currentCard.style,
                    value: app.currentCard.value,
                    evolves: app.currentCard.evolves,
                };
                console.log(newCard);

                fetch('/card', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify(newCard)}).then((res)=>{
                    res.json().then(data=>{
                        //console.log(data);
                        getAllCards();
                    });
                });
            },
            loadCardByName: () => {
                fetch('/getCard', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:app.currentCard.name})}).then((res)=>{
                    res.json().then(data=>{
                        //console.log(data);
                        app.currentCard = data;
                        updateCard();
                    });
                });
            },
            loadCardByClick: (name) => {
                app.currentCard.name = name;
                app.loadCardByName();
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
            deleteCard: () => {
                fetch('/deleteCard', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify({name: app.currentCard.name})}).then((res)=>{
                    res.json().then(data=>{
                        //console.log(data);
                        getAllCards();
                    });
                });
            },
            setStyle: (el) => {
                console.log(el);
                app.currentCard.style = el;
                updateCard();
            },
        },
        watch: {
            
        },
        updated() {
            
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
