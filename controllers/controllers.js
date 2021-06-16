const {
  selectCategories,
  selectReviewById,
  insertReviewById,
} = require('../models/models');

exports.getCategories = (req, res) => {
  selectCategories()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      // console.log(err);
    });
};

exports.getReviewById = (req, res, next) => {
  // console.log('hello');
  // console.log(Object.keys(req));
  const reviewId = req.params.review_id;
  // console.log(reviewId);
  selectReviewById(reviewId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { votes } = req.body;

  if (!votes) res.status(400).send({ msg: 'Invalid vote key' });
  else
    insertReviewById(review_id, votes)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch(next);
};
