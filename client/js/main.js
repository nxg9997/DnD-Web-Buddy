var app;

class Player {
    constructor(name){
        this.name = name;
        this.hp = 200;
        this.atk = 5;
        this.def = 5;
        this.atkMult = 0;
        this.defMult = 0;

        this.extraDmg = 0;
    }

    toString() {
        return `${this.name},${this.hp},${this.atk},${this.def},${this.atkMult},${this.defMult},${this.extraDmg}`;
    }

    fromArr(arr) {
        this.name = arr[0];
        console.log(this.name);
        this.hp = arr[1];
        this.atk = arr[2];
        this.def = arr[3];
        this.atkMult = arr[4];
        this.defMult = arr[5];
        this.extraDmg = arr[6];
    }
}

(function(){
    console.log('hello world');

    if(window.location.pathname === '/'){
        //initSocket();
    }

    let forms = document.querySelectorAll('form');
    for(let i = 0; i < forms.length; i++){
        forms[i].onsubmit = (e) => {
            e.preventDefault();
        };
    }

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
            ],
            currentCard: {
                name: 'Name',
                type: 'Type',
                topText: 'Top Text',
                bottomText: 'Bottom Text',
            },
            user: 'unknown',
            dlbtnHref: '/builder.html',
            stats: {
                player1: new Player('Player 1'),
                player2: new Player('Player 2'),
            },
            roomID: '',
            atkMult: 0.25,
            defMult: 0.25,
        },
        methods: {
            emitChange: () => {
                socket.emit('stat update', app.stats.player1.toString() + "?" + app.stats.player2.toString());
            },
            attackFromP1: () => {
                attack(app.stats.player1, app.stats.player2);
                
            },
            attackFromP2: () => {
                attack(app.stats.player2, app.stats.player1);
            },
            changeRoom: () => {
                socket.emit('room change', app.roomID);
            },
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
                };
                console.log(newCard);

                fetch('/card', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify(newCard)}).then((res)=>{
                    res.json().then(data=>{
                        console.log(data);
                        getAllCards();
                    });
                });
            },
            loadCardByName: () => {
                fetch('/getCard', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify({name:app.currentCard.name})}).then((res)=>{
                    res.json().then(data=>{
                        console.log(data);
                        app.currentCard = data;
                        updateCard();
                    });
                });
            },
            loadCardByClick: (name) => {
                app.currentCard.name = name;
                app.loadCardByName();
            },
            deleteCard: () => {
                fetch('/deleteCard', {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify({name: app.currentCard.name})}).then((res)=>{
                    res.json().then(data=>{
                        console.log(data);
                        getAllCards();
                    });
                });
            }
        },
        watch: {
            stats: () => {
                app.emitChange();
            },
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