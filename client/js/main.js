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
            links: [
                {
                    label: 'Card Builder',
                    href: './builder',
                },
                {
                    label: 'Stat Tracker',
                    href: './',
                },
            ],
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
            }
        },
        watch: {
            stats: () => {
                app.emitChange();
            }
        }
    });

    

})();