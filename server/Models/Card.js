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
    style: {
        type: String,
        trim: true,
        default: 'Field',
    },
    value: {
        type: String,
        required: false,
        trim: true,
    },
    evolves: {
        type: Boolean,
        required: false,
        default: false,
    }
});

CardSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    type: doc.type,
    topText: doc.topText,
    bottomText: doc.bottomText,
    art: doc.art,
    style: doc.style,
    value: doc.value,
    evolves: doc.evolves,
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