const apiInfo = require('../endpoints');

const {
  selectCategories,
  selectReviews,
  selectReviewById,
  selectCommentsByReviewId,
  updateVotesById,
  insertCommentByReviewId,
  sqlDelCommentById,
  selectUsers,
  selectUserByUsername,
  insertReview,
  // insertCategory,
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

exports.patchVotesById = (req, res, next) => {
  updateVotesById(req.params, req.body)
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  sqlDelCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getUsers = (req, res) => {
  selectUsers().then((result) => {
    res.status(200).send(result);
  });
};

exports.getUserByUsername = (req, res, next) => {
  selectUserByUsername(req.params.username)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
};

exports.postReview = (req, res, next) => {
  const { body } = req;
  insertReview(body)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch(next);
};

// exports.postCategory = (req, res, next) => {
//   const { body } = req;
//   insertCategory(body).then((result) => {
//     res.status(201).send(result);
//   });
// };
