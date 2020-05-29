const mongoose = require('mongoose');

let DeckModel = {};

const DeckSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    cards: {
        type: Array,
        required: true,
        default: [],
    },
    CreatedDate: {
        type: Date,
        default: Date.now,
    },
});

DeckSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    cards: doc.cards,
});

DeckSchema.statics.findByName = (name, callback) => {
    const search = {
        name: name,
    };

    return DeckModel.findOne(search, callback);
};

DeckModel = mongoose.model('Deck', DeckSchema);

module.exports.DeckModel = DeckModel;
module.exports.DeckSchema = DeckSchema;