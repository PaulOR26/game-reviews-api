exports.itemNotFound = (item) => {
  return Promise.reject({
    status: 404,
    msg: `${item} does not exist`,
  });
};

exports.badVoteData = (reqBody, incVotes) => {
  let isError = false;
  let errMsg = '';

  if (Object.keys(reqBody).length === 0) {
    isError = true;
    errMsg = 'Invalid input: no data submitted';
  } else if (Object.keys(reqBody).length > 1) {
    isError = true;
    errMsg = 'Invalid input: There should only be 1 vote key (inc_votes)';
  } else if (!incVotes) {
    isError = true;
    errMsg = 'Invalid input: vote key should be "inc_votes';
  } else if (!/^-*\d+$/.test(incVotes.toString())) {
    isError = true;
    errMsg = 'Invalid input: value should be a whole number';
  }

  return [isError, errMsg];
};

exports.rejectData = (errMsg) => {
  return Promise.reject({
    status: 400,
    msg: errMsg,
  });
};

exports.badSortBy = () => {
  return Promise.reject({
    status: 400,
    msg: 'Invalid input: sort_by column does not exist',
  });
};

exports.badOrder = () => {
  return Promise.reject({
    status: 405,
    msg: 'Invalid input: order should be asc or desc',
  });
};

exports.badCategory = () => {
  return Promise.reject({
    status: 400,
    msg: "Invalid input: category doesn't exist",
  });
};

exports.noCatResults = () => {
  return Promise.reject({
    status: 404,
    msg: 'No reviews for selected category',
  });
};
