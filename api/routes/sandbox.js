var express = require("express");
var router = express.Router();

const ChartModel = require("./../models/Chart");
const GameSchema = require("./../models/schemas/Game");

/* GET home page. */
router.get("/", async function(req, res, next) {
  const wait = new Promise((resolve, reject) => {
    setTimeout(resolve, 130000);
  });

  wait.then(() => {
    res.json("yo");
  });
});

module.exports = router;
