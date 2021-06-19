const apiInfo = require('../endpoints');

const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectCommentsByReviewId,
  updateReviewById,
  insertCommentByReviewId,
} = require('../mvc/models');

exports.getApi = (req, res) => {
  res.send({ endPoints: apiInfo });
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

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;
  updateReviewById(review_id, body)
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

exports.postCommentByReviewById = (req, res, next) => {
  const { username } = req.body;
  const { body } = req.body;
  const { review_id } = req.params;
  insertCommentByReviewId(username, review_id, body)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch(next);
};
