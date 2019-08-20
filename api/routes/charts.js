var express = require("express");
var router = express.Router();
const ObjectId = require("mongodb").ObjectID;
const getChartData = require("./../services/charts/ChartsData");
const SchemaFactory = require("./../models/schemas/SchemaFactory");
const ChartModel = require("./../models/Chart");

/**
 * GET charts
 */
router.get("/", async function(req, res, next) {
  ChartModel.find().then(data => {
    res.json(data);
  });
});

router.get("/options", function(req, res, next) {
  res.json(SchemaFactory("Game").getChartOptions());
});

router.post("/", async function({ body }, res, next) {
  body.dataSource = "Game";
  ChartModel.save(body).then(({ result }) => {
    res.json(result);
  });
});

router.put("/", async function(req, res, next) {
  const { body: document } = req;
  document._id = new ObjectId(document._id);
  ChartModel.updateOne(document).then(({ result }) => {
    res.json(result);
  });
});

router.delete("/:_id", function(req, res, next) {
  const { _id } = req.params;
  ChartModel.deleteOne(new ObjectId(_id)).then(({ result }) => {
    res.json(result);
  });
});

/* GET one chart */
router.get("/:id", function(req, res, next) {
  res.json({ id: req.params.id });
});

/* GET chart's data */
router.get("/:id/data", async function({ params: { id } }, res, next) {
  const query = {
    _id: new ObjectId(id)
  };

  ChartModel.findOne(query)
    .then(getChartData)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err.message);
    });
});

module.exports = router;
