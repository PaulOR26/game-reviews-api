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
      return { review: result.rows[0] };
    });
};
