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
      // console.log(result.rows);
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
