const Game = require("./Game");
const Chart = require("./Chart");
const Position = require("./Position");

const schemasMap = {
  Game,
  Chart,
  Position
};

module.exports = dataSource => {
  return schemasMap[dataSource];
};
