const { rejectData } = require('./errors/custom-errors');

exports.checkString = async (postedObj) => {
  let isString = true;

  for (const val in postedObj) {
    if (typeof postedObj[val] !== 'string') isString = false;
  }

  if (!isString)
    await rejectData(
      'Invalid input: submitted data should be in string format'
    );
};
exports.checkKeys = async (expectedKeys, givenKeys) => {
  const missingKeys = expectedKeys.filter((key) => !givenKeys.includes(key));

  if (missingKeys.length > 0)
    await rejectData(
      `Invalid input: posted object should include ${missingKeys.join(' & ')}`
    );
};
