const express = require("express");
const router = express.Router();
const importService = require("./../services/import/games");

/* GET users listing. */
router.get("/:username/:importKey", async function(req, res, next) {
  req.setTimeout(0);
  const {
    params: { username, importKey }
  } = req;
  importService
    .runImport(username, importKey)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

module.exports = router;
