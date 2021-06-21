const commentsRouter = require('express').Router();

const { deleteCommentById, patchVotesById } = require('../mvc/controllers');

commentsRouter
  .route('/:comment_id')
  .delete(deleteCommentById)
  .patch(patchVotesById);

module.exports = commentsRouter;
