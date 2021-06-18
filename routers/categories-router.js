const categoriesRouter = require('express').Router();

const { getCategories } = require('../controllers/controllers');

categoriesRouter.route('/').get(getCategories);

module.exports = categoriesRouter;
