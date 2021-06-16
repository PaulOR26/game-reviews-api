const express = require('express');
const { getCategories, getReviewById } = require('./controllers/controllers');
const app = express();

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewById);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
