const express = require("express");
const router = express.Router();

const PositionModel = require("./../models/Position");

/* GET random position. */
router.get("/random/", async function(req, res, next) {
  const {
    query: { pieceCount }
  } = req;
  const position = await PositionModel.aggregate([
    {
      $match: {
        pieceCount: Number(pieceCount)
      }
    },
    { $sample: { size: 1 } }
  ]).toArray();
  res.json(position[0]);
});

module.exports = router;
