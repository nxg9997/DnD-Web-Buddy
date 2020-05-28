const models = require('../Models');

const { Deck } = models;

const create = (request, response) => {
    const req = request;
    const res = response;

    req.body.name = `${req.body.name}`;

    if(!req.body.name){
        return res.status(400).json({ error: 'Name field is required' });
    }

    //console.log(req.body);

    const deckData = {
        name: req.body.name,
        cards: req.body.cards,
    };

    //console.log(deckData.name);

    const newDeck = new Deck.DeckModel(deckData);

    const deckPromise = newDeck.save();

    deckPromise.then(() => res.json({success:'Deck Added'}));

    deckPromise.catch((err)=>{
        //console.log(err);
        if(err.code === 11000){
            return update(req,res);
        }
        return res.status(400).json({error:'Error creating the deck'});
    });

    return deckPromise;

};

const update = (req, res) => {
    const deckData = {
        name: req.body.name,
        cards: req.body.cards,
    };

    Deck.DeckModel.updateOne({name: deckData.name}, deckData, (err) => {
        if(err){
            return res.status(400).json({error:'Error editing the deck'});
        }
        return res.status(200).json({success:'Modified the deck'});
    });
}

const getDeckByName = (request, response, callback) => {
    const req = request;

    Deck.DeckModel.findByName(req.body.name, (err,doc) => {
        if(err){
            console.log(err);
            callback({ error: 'Error finding the deck'});
            return;
        }

        callback({deck: doc});
    });
};

const getAllDecks = (request, response, callback) => {
    const req = request;

    Deck.DeckModel.find({}, (err, docs) => {
        callback(docs);
    });
};

const deleteDeck = (request, response) => {
    const req = request;
    const res = response;

    const filter = {
        name: `${req.body.name}`,
    };

    return Deck.DeckModel.deleteOne(filter, (err) => {
        if(err){
            console.log(err);
            return res.status(400).json({error:'Error deleting the deck'});
        }

        return res.json({success:'Deleted the deck successfully'});
    });
};

module.exports.create = create;
module.exports.getDeckByName = getDeckByName;
module.exports.getAllDecks = getAllDecks;
module.exports.deleteDeck = deleteDeck;