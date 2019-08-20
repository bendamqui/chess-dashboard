const BaseModel = require("./BaseModel");
const PositionSchema = require("./schemas/Position");

module.exports = BaseModel("positions", PositionSchema);
