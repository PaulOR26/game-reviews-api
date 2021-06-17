// Endpoint path not found
exports.notFound = (req, res) => {
  res.status(404).send({ msg: 'Path not recognised' });
};

// Handling custom
exports.handleCustomerErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

// Handling psql
exports.handlePsqlErrors = (err, req, res, next) => {
  console.log(err);
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Review ID should be a number' });
  } else next(err);
};

// Handling 500
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
};
