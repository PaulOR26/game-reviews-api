const express = require('express');
const { getCategories, getReviewById } = require('./controllers/controllers');
const app = express();

app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewById);

module.exports = app;
