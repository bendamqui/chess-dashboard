const Chart = require("./Chart");
const Game = require("./Game");
const Position = require("./Position");

const models = {
  Chart,
  Game,
  Position
};

module.exports = modelName => {
  return models[modelName];
};
