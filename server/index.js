console.log('hello world');
const https = require("https");
let fs = require('fs');
const port = process.env.PORT || 3000; // gets the port from heroku, or defaults to port 3000
let express =  require('express');
let parser = require('body-parser');



//create express app
let app = express();
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json({type:'application/json'}));
app.use(express['static'](`${__dirname}/../client`));



/*app.get('/', (req,res) => {
    fs.readFile(`./client/index.html`, (err, data) => {
        if(err){
            return res.status(500).json({error:'Error reading resource'});
        }
        else{
            return res.status(200).type('text/html').send(data);
        }
    })
})*/

let server = app.listen(port, (err) => {
    if(err){
        console.log(err);
        return;
    }
    console.log('Listening on port ' + port);
});

let io = require('./network').io(server);