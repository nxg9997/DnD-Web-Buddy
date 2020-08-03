console.log('hello world');
const https = require("https");
const fs = require('fs');
const port = process.env.PORT || 3000; // gets the port from heroku, or defaults to port 3000
const express =  require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');
const controllers = require('./Controllers');
const request = require('request');
const formidable = require('formidable');
const eformidable = require('express-formidable');
const papa = require('papaparse');
const multer = require('multer');
const upload = multer();
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/dndwebbuddy';

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(dbURL, mongooseOptions, (err) => {
    if(err){
        console.log('couldn\'t connect to db');
        throw err;
    }
});


//create express app
let app = express();
//app.use(eformidable());
//app.use(upload.array());
//app.use(express.static('public'));
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json({type:'application/json'}));
app.use(express['static'](`${__dirname}/../client`));


app.post('/card', (req, res) => {
    console.log(req.body);
    controllers.Card.create(req,res);
});

app.post('/getCard', (req, res) => {
    console.log("request received");
    controllers.Card.getCardByName(req,res,(data)=>{
        //data.card.blah
        res.send(data.card);
    });
});

app.get('/getCard', (req, res) => {
    controllers.Card.getAllCards(req,res,(data) => {
        console.log(data);
        res.send(data);
    });
});

app.get('/art', (req, res) => {
    //console.log(req.url);
    let split = req.url.split('?');
    let src = split[1].split('=')[1];
    //console.log(src);

    request({url:src, encoding:null, method: 'GET'},(error,res2,body)=>{
        if(error){
            console.log(error);
            return res.status(501).json({error:'error'});
        }
        //console.log(res2);
        res.set('Content-Type', res2.headers['content-type']);
        res.send(body);
    });
});

app.post('/deleteCard', (req, res) => {
    controllers.Card.deleteCard(req,res);
});

app.post('/deck', (req, res) => {
    console.log(req.body);
    controllers.Deck.create(req,res);
});

app.post('/getDeck', (req, res) => {
    controllers.Deck.getDeckByName(req,res,(data)=>{
        //data.card.blah
        res.send(data.deck);
    });
});

app.get('/getDeck', (req, res) => {
    controllers.Deck.getAllDecks(req,res,(data) => {
        console.log(data);
        res.send(data);
    });
});

app.post('/deleteDeck', (req, res) => {
    controllers.Deck.deleteDeck(req,res);
});

app.post('/csvupload', (req, res) => {
    //console.log(req);
    //return;
    let form = new formidable.IncomingForm();
    form.parse(req,(err, fields, files)=>{
        console.log(files);
        //return;
        let rawData = fs.readFileSync(files.csv.path);
        let stringed = rawData.toString();
        /*let split = stringed.split('\r\n');
        console.log(split);*/
        //return;
        papa.parse(stringed, {
            complete: (result) => {
                let parsed = result.data;
                //console.log(parsed);
                for(let i = 1; i < parsed.length; i++){
                    //console.log(parsed[i]);
                    let count = 0;
                    for(let j = 0; j < parsed[i].length; j++){
                        if(parsed[i][j] !== ""){
                            count++;
                        }
                    }
                    if(count > 1){
                        let fakereq = {
                            body: {
                                name: parsed[i][0],
                                type: parsed[i][2],
                                topText: parsed[i][3],
                                bottomText: parsed[i][6],
                                art: parsed[i][10],
                                user: parsed[i][9],
                                style: parsed[i][1],
                                value: parsed[i][4],
                                evolves: parsed[i][7] === "TRUE" ? true : false,
                                mana: parsed[i][5]
                            }
                        };
                        console.log(fakereq.body.name)
                        controllers.Card.create(fakereq, res, true);
                    }
                }
                res.send({result:'done'});
            }
        });
    });
    //return;
    
    //console.log(parsed);
    
    //const form = formidable({multiples: true});
    /*form.parse(req, (err, fields, files) => {
        console.log(files);
        let oldPath = files.csv.path;
        //let newPath = path.join(__dirname, 'uploads') + '/' + files.csv.name;
        let rawData = fs.readFileSync(oldPath);
        console.log(rawData);
    });*/
    
});

/*app.get('/builder', (req, res) => {
    res.sendfile('../client/builder.html');
});*/

let server = app.listen(port, (err) => {
    if(err){
        console.log(err);
        return;
    }
    console.log('Listening on port ' + port);
});

let io = require('./network').io(server);