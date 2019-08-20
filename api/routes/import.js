const express = require("express");
const router = express.Router();
const importService = require("./../services/import/games");
const profiler = require("./../profiler");
/* GET users listing. */

router.get("/:username", async function(req, res, next) {
  req.setTimeout(0);
  const {
    params: { username }
  } = req;
  importService
    .runImport(username)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err.message);
    });
});

module.exports = router;
