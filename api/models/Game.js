const BaseModel = require("./BaseModel");
const GameSchema = require("./schemas/Game");

module.exports = BaseModel("games", GameSchema);
