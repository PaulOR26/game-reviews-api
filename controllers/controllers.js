const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectCommentsByReviewId,
  insertReviewById,
} = require('../models/models');

exports.getApi = (req, res) => {
  res.send();
};

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
  const { review_id } = req.params;

  selectReviewById(review_id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewId(review_id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;
  insertReviewById(review_id, body)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};
