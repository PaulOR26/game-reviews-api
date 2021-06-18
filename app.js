const express = require('express');
const {
  getCategories,
  getReviewById,
  getReviews,
  getCommentsByReviewId,
  patchReviewById,
} = require('./controllers/controllers');
const {
  handleCustomerErrors,
  handlePsqlErrors,
  handleServerErrors,
  notFound,
} = require('./errors/error-handlers');
const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id', getReviewById);
app.get('/api/reviews/:review_id/comments', getCommentsByReviewId);

app.patch('/api/reviews/:review_id', patchReviewById);

app.all('*', notFound);

app.use(handleCustomerErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
