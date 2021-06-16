const db = require('../db/connection');

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then((result) => {
    return { categories: result.rows };
  });
};

exports.selectReviewById = (reviewId) => {
  return db
    .query(
      `
  SELECT * FROM reviews
  WHERE review_id = $1
  ;
  `,
      [reviewId]
    )
    .then((result) => {
      const review = result.rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: 'Requested review does not exist',
        });
      }
      return { review: review };
    });
};

exports.insertReviewById = (review_id, votes) => {
  // console.log(votes, 'here');
  if (/\d/.test(votes)) {
    return db
      .query(
        `
  UPDATE reviews
  SET
  votes = votes + $1
  WHERE review_id = $2
  RETURNING *
  `,
        [votes, review_id]
      )
      .then((result) => {
        return { newVotes: result.rows[0].votes };
      });
  } else return Promise.reject({ status: 400, msg: 'Invalid vote value' });
};
