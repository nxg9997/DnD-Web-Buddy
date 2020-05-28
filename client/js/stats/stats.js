var socket = io();

socket.on('stat update', (msg) => {
    console.log(msg);
    updateStats(msg);
});

function updateStats(str){
    let split = str.split('?');
    for(let i = 0; i < split.length; i++){
        let ps = split[i].split(',');
        if(i === 0) app.stats.player1.fromArr(ps);
        if(i === 1) app.stats.player2.fromArr(ps);
    }
}

// - p1 attacks p2
function attack(p1,p2){
    console.log("attack!");
    let dmg = ((parseInt(p1.atk) * (parseFloat(p1.atkMult) * 0.25 + 1)) + parseInt(p1.extraDmg)) - (parseInt(p2.def) * (parseFloat(p2.defMult) * 0.25 + 1));
    if(dmg < 0) dmg = 0;

    p2.hp = Math.round(parseFloat(p2.hp) - dmg);

    app.emitChange();
}

function attackV2(p1,p2){
    // dmg = (((2 * L / 5 + 2) * P * A / D) / 50 + 2) * modifier
    let L = 1; // level
    let aM = 1 + (0.5 * parseFloat(p1.atkMult));
    let dM = 1 + (0.5 * parseFloat(p2.defMult));
    let dmg = ((parseFloat(p1.extraDmg) * parseFloat(p1.atk) * aM / parseFloat(p2.def) * dM) / 1 + 2);

    if(dmg < 0) dmg = 0;

    p2.hp = Math.round(parseFloat(p2.hp) - dmg);

    app.emitChange();
}