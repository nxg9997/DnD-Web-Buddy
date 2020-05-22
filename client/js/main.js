var app;

class Player {
    constructor(name){
        this.name = name;
        this.hp = 200;
        this.atk = 5;
        this.def = 5;
        this.atkMult = 1;
        this.defMult = 1;
    }

    toString() {
        return `${this.name},${this.hp},${this.atk},${this.def},${this.atkMult},${this.defMult}`;
    }
}

(function(){
    console.log('hello world');

    if(window.location.pathname === '/'){
        //initSocket();
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
                player1: new Player(''),
                player2: new Player(''),
            }
        },
        methods: {
            emitChange: () => {
                socket.emit('stat update', app.stats.player1.toString() + "?" + app.stats.player2.toString());
            }
        },
        watch: {
            stats: () => {
                app.emitChange();
            }
        }
    });

    

})();