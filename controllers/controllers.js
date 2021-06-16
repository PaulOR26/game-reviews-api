const { selectCategories, selectReviewById } = require('../models/models');

exports.getCategories = (req, res) => {
  selectCategories()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectReviewById(reviewId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};
