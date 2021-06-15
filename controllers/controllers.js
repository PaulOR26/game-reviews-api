const { selectCategories } = require("../models/models");

function getCategories(req, res) {
  selectCategories()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { getCategories };
