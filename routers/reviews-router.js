const reviewsRouter = require('express').Router();

const {
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  patchReviewById,
} = require('../controllers/controllers');

reviewsRouter.route('/').get(getReviews);

reviewsRouter.route('/:review_id').get(getReviewById).patch(patchReviewById);

reviewsRouter.route('/:review_id/comments').get(getCommentsByReviewId);

module.exports = reviewsRouter;
