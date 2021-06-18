const {
  selectCategories,
  selectReviewById,
  insertReviewById,
  selectReviews,
} = require('../models/models');

exports.getCategories = (req, res) => {
  selectCategories().then((result) => {
    res.status(200).send(result);
  });
};

exports.getReviews = (req, res, next) => {
  const { query } = req;
  selectReviews(query)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;

  selectReviewById(reviewId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  insertReviewById(req)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};
