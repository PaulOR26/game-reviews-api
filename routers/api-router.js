const apiRouter = require('express').Router();
const reviewsRouter = require('../routers/reviews-router');
const categoriesRouter = require('../routers/categories-router');

const { getApi } = require('../controllers/controllers');

apiRouter.route('/').get(getApi);

apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/categories', categoriesRouter);

module.exports = apiRouter;
