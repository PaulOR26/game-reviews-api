const apiRouter = require('express').Router();
const reviewsRouter = require('./reviews-router');
const categoriesRouter = require('./categories-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');

const { getApi } = require('../mvc/controllers');

apiRouter.route('/').get(getApi);

apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
