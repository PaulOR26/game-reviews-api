const db = require('../db/connection');
const reviews = require('../db/data/test-data/reviews');

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then((result) => {
    return { categories: result.rows };
  });
};

exports.selectReviewById = (reviewId) => {
  return db
    .query(
      `
      SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON comments.review_id = reviews.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id
  ;
  `,
      [reviewId]
    )
    .then((result) => {
      if (!result.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: 'Requested review does not exist',
        });
      } else {
        return { review: result.rows[0] };
      }
    });
};

exports.insertReviewById = (req) => {
  let isError = false;
  let errMsg = '';

  const { review_id } = req.params;
  const { inc_votes } = req.body;

  if (Object.keys(req.body).length === 0) {
    isError = true;
    errMsg = 'Invalid input: no data submitted';
  } else if (Object.keys(req.body).length > 1) {
    isError = true;
    errMsg = 'Invalid input: There should only be 1 vote key (inc_votes)';
  } else if (!inc_votes) {
    isError = true;
    errMsg = 'Invalid input: vote key should be "inc_votes';
  } else if (!/^-*\d+$/.test(inc_votes)) {
    isError = true;
    errMsg = 'Invalid input: value should be a whole number';
  }
  if (isError) {
    return Promise.reject({
      status: 400,
      msg: errMsg,
    });
  } else
    return db
      .query(
        `
  UPDATE reviews
  SET
  votes = votes + $1
  WHERE review_id = $2
  RETURNING *
  `,
        [inc_votes, review_id]
      )
      .then((result) => {
        return { newVotes: result.rows[0].votes };
      });
};

exports.selectReviews = (query) => {
  const reviewCols = [
    'owner',
    'title',
    'review_id',
    'category',
    'review_img_url',
    'created_at',
    'votes',
  ];

  const { sort_by } = query;
  const { order } = query;
  const { category } = query;

  if (reviewCols.includes(sort_by) && (order === 'asc' || order === 'desc')) {
    return db
      .query(
        `
        SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(comments.review_id)::INT AS comment_count 
        FROM reviews
        LEFT JOIN comments
        ON comments.review_id = reviews.review_id
        GROUP BY reviews.review_id
        ORDER BY ${sort_by} ${order}
    ;`
      )
      .then((result) => {
        return { reviews: result.rows };
      });
  }
  //   console.log(sort_by);
  // console.log(order);
  // console.log(category);
};
