const reviewsRouter = require('express').Router();

const {
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  patchReviewById,
  postCommentByReviewById,
} = require('../mvc/controllers');

reviewsRouter.route('/').get(getReviews);

reviewsRouter.route('/:review_id').get(getReviewById).patch(patchReviewById);

reviewsRouter
  .route('/:review_id/comments')
  .get(getCommentsByReviewId)
  .post(postCommentByReviewById);

module.exports = reviewsRouter;
