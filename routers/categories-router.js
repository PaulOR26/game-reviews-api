const categoriesRouter = require('express').Router();

const { getCategories, postCategory } = require('../mvc/controllers');

categoriesRouter.route('/').get(getCategories).post(postCategory);

module.exports = categoriesRouter;
