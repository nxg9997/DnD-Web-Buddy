const models = require('../Models');

const { Card } = models;

const create = (request, response) => {
    const req = request;
    const res = response;

    req.body.name = `${req.body.name}`;
    if(req.body.type) req.body.type = `${req.body.type}`;
    if(req.body.topText) req.body.topText = `${req.body.topText}`;
    if(req.body.bottomText) req.body.bottomText = `${req.body.bottomText}`;
    if(req.body.art) req.body.art = `${req.body.art}`;
    if(req.body.user) req.body.user = `${req.body.user}`;

    if(!req.body.name){
        return res.status(400).json({ error: 'Name field is required' });
    }

    //console.log(req.body);

    const cardData = {
        name: req.body.name,
        type: req.body.type?req.body.type:'',
        topText: req.body.topText?req.body.topText:'',
        bottomText: req.body.bottomText?req.body.bottomText:'',
        art: req.body.art?req.body.art:'',
        user: req.body.user?req.body.user:'',
    };

    //console.log(cardData.name);

    const newCard = new Card.CardModel(cardData);

    const cardPromise = newCard.save();

    cardPromise.then(() => res.json({success:'Card Added'}));

    cardPromise.catch((err)=>{
        //console.log(err);
        if(err.code === 11000){
            return update(req,res);
        }
        return res.status(400).json({error:'Error creating the card'});
    });

    return cardPromise;

};

const update = (req, res) => {
    const cardData = {
        name: req.body.name,
        type: req.body.type?req.body.type:'',
        topText: req.body.topText?req.body.topText:'',
        bottomText: req.body.bottomText?req.body.bottomText:'',
        art: req.body.art?req.body.art:'',
        user: req.body.user?req.body.user:'',
    };

    Card.CardModel.updateOne({name: cardData.name}, cardData, (err) => {
        if(err){
            return res.status(400).json({error:'Error editing the card'});
        }
        return res.status(200).json({success:'Modified the card'});
    });
}

const getCardByName = (request, response, callback) => {
    const req = request;

    Card.CardModel.findByName(req.body.name, (err,doc) => {
        if(err){
            console.log(err);
            callback({ error: 'Error finding the card'});
            return;
        }

        callback({card: doc});
    });
};

const getAllCards = (request, response, callback) => {
    const req = request;

    Card.CardModel.find({}, (err, docs) => {
        callback(docs);
    });
};

module.exports.create = create;
module.exports.getCardByName = getCardByName;
module.exports.getAllCards = getAllCards;