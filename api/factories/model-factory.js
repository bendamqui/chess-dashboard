const { getCollection } = require('./../db/mongo');

const GameModel = require('./../models/GameModel');

const factory = (model) => {
    switch (model) {
        case 'Game':
            return new GameModel(getCollection);
        default:
            throw new Error(`Cannot find model ${model}`)
    }
}

module.exports = (model) => factory(model);