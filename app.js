const express = require('express');

const {
  handleCustomerErrors,
  handlePsqlErrors,
  handleServerErrors,
  notFound,
} = require('./errors/error-handlers');

const apiRouter = require('./routers/api-router');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('*', notFound);

app.use(handleCustomerErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
