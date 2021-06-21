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
  if (err.code === '22P02') {
    res.status(400).send({
      msg: `Invalid input: ${req.route.path.match(
        /[\w]+/
      )} should be a whole number`,
    });
  } else if (err.code === '23503') {
    res.status(400).send({ msg: 'Invalid input: user does not exist' });
  } else next(err);
};

// Handling 500
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
};
