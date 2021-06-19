const categoriesRouter = require('express').Router();

const { getCategories } = require('../mvc/controllers');

categoriesRouter.route('/').get(getCategories);

module.exports = categoriesRouter;
