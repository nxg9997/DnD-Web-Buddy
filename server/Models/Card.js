const mongoose = require('mongoose');

let CardModel = {};

const CardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    type: {
        type: String,
        required: false,
        trim: true,
    },
    topText: {
        type: String,
        required: false,
        trim: true,
    },
    bottomText: {
        type: String,
        required: false,
        trim: true,
    },
    art: {
        type: String,
        required: false,
        trim: true,
    },
    CreatedDate: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: String,
        required: false,
        trim: true,
    },
});

CardSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    type: doc.type,
    topText: doc.topText,
    bottomText: doc.bottomText,
    art: doc.art,
});

CardSchema.statics.findByName = (name, callback) => {
    const search = {
        name: name,
    };

    return CardModel.findOne(search, callback);
};

CardModel = mongoose.model('Card', CardSchema);

module.exports.CardModel = CardModel;
module.exports.CardSchema = CardSchema;