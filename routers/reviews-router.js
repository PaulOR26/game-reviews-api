const reviewsRouter = require('express').Router();

const {
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  patchVotesById,
  postCommentByReviewById,
  postReview,
} = require('../mvc/controllers');

reviewsRouter.route('/').get(getReviews).post(postReview);

reviewsRouter.route('/:review_id').get(getReviewById).patch(patchVotesById);

reviewsRouter
  .route('/:review_id/comments')
  .get(getCommentsByReviewId)
  .post(postCommentByReviewById);

module.exports = reviewsRouter;
