console.log('hello world');
const https = require("https");
const fs = require('fs');
const port = process.env.PORT || 3000; // gets the port from heroku, or defaults to port 3000
const express =  require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');
const controllers = require('./Controllers');

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
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json({type:'application/json'}));
app.use(express['static'](`${__dirname}/../client`));


app.post('/card', (req, res) => {
    console.log(req.body);
    controllers.Card.create(req,res);
});

app.post('/getCard', (req, res) => {
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

app.post('/deleteCard', (req, res) => {
    controllers.Card.deleteCard(req,res);
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