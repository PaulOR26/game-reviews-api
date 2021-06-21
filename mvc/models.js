const db = require('../db/connection');
const format = require('pg-format');

const {
  itemNotFound,
  badVoteData,
  rejectData,
  badSortBy,
  badOrder,
  badCategory,
  noCatResults,
} = require('../errors/custom-errors');
const reviews = require('../db/data/test-data/reviews');

exports.selectCategories = async () => {
  const { rows } = await db.query(`SELECT * FROM categories;`);
  return { categories: rows };
};

exports.selectReviews = async (query) => {
  const reviewCols = [
    'owner',
    'title',
    'review_id',
    'category',
    'review_img_url',
    'created_at',
    'votes',
  ];

  const { rows } = await db.query(`
  SELECT slug FROM categories;
  `);

  const categories = rows.map((cat) => {
    return cat.slug;
  });

  const { sort_by = 'created_at' } = query;
  const { order = 'desc' } = query;
  const { category } = query;

  const filters = [];

  let qryStr = `
  SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(comments.review_id)::INT AS comment_count 
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id
  `;

  if (categories.includes(category)) {
    filters.push(category);
    qryStr += `
  WHERE category = $1
  `;
  } else if (category) await badCategory();

  qryStr += `
  GROUP BY reviews.review_id
  `;

  if (!reviewCols.includes(sort_by)) await badSortBy();
  if (order !== 'desc' && order !== 'asc') await badOrder();

  qryStr += `
  ORDER BY ${sort_by} ${order}
    `;

  const { rows: qryResults } = await db.query(qryStr + ';', filters);

  if (category && qryResults.length === 0) {
    await noCatResults();
  }

  return { reviews: qryResults };
};

exports.selectReviewById = async (reviewId) => {
  const { rows: qryResults } = await db.query(
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
  );

  if (!qryResults[0]) await itemNotFound('Review');
  else return { review: qryResults[0] };
};

exports.updateVotesById = async (params, body) => {
  const table = params.review_id ? 'reviews' : 'comments';
  const param = `${table.slice(0, -1)}_id`;

  const { inc_votes } = body;

  const [isError, errMsg] = badVoteData(body, inc_votes);

  if (isError) await rejectData(errMsg);
  else {
    const { rows } = await db.query(
      `
  UPDATE ${table} SET votes = votes + $1
  WHERE ${param} = $2
  RETURNING *;
  `,
      [inc_votes, params[param]]
    );

    return {
      [`updated${table.charAt(0).toUpperCase()}${table.slice(1, -1)}`]: rows[0],
    };
  }
};

exports.selectCommentsByReviewId = async (reviewId) => {
  const { rows: qryResults } = await db.query(
    `
SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body  FROM reviews
LEFT JOIN comments
ON reviews.review_id = comments.review_id
WHERE comments.review_id = $1
;
`,
    [reviewId]
  );
  if (qryResults.length === 0) await itemNotFound('Review');
  else return { comments: qryResults };
};

exports.insertCommentByReviewId = async (username, reviewId, body) => {
  const { rows } = await db.query(
    `
    SELECT * FROM reviews
    WHERE review_id = $1;
    `,
    [reviewId]
  );

  if (!rows[0]) await itemNotFound('Review');
  else if (!username || !body)
    await rejectData(
      'Invalid input: posted object should contain username and body keys'
    );
  else if (typeof body !== 'string')
    await rejectData('Invalid input: comment should be a string');
  else {
    const commentsInsert = format(
      `
    INSERT INTO comments
    (author, review_id, body)
    VALUES
    (%L)
    RETURNING body;
    `,
      [username, reviewId, body]
    );

    const { rows: qryResults } = await db.query(commentsInsert);

    qryResults[0].newComment = qryResults[0].body;
    delete qryResults[0].body;

    return qryResults[0];
  }
};

exports.sqlDelCommentById = async (commentId) => {
  const { rows } = await db.query(
    `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;
  `,
    [commentId]
  );

  if (!rows[0]) await itemNotFound('Comment');
};

exports.selectUsers = async () => {
  const { rows } = await db.query(`
  SELECT username FROM users;
  `);

  return { users: rows };
};

exports.selectUserByUsername = async (username) => {
  const { rows } = await db.query(
    `
  SELECT * FROM users
  WHERE username = $1;
  `,
    [username]
  );

  if (!rows[0]) await itemNotFound('User');
  else return { user: rows[0] };
};

exports.insertReview = async (body) => {
  let isString = true;

  for (const val in body) {
    if (typeof body[val] !== 'string') isString = false;
  }

  const expectedKeys = [
    'owner',
    'title',
    'review_body',
    'designer',
    'category',
  ];

  const givenKeys = Object.keys(body);

  const missingKeys = expectedKeys.filter((key) => !givenKeys.includes(key));

  if (missingKeys.length > 0)
    await rejectData(
      `Invalid input: posted object should include ${missingKeys.join(' & ')}`
    );
  else if (!isString)
    await rejectData(
      'Invalid input: submitted data should be in string format'
    );
  else {
    const reviewsInsert = format(
      `
    INSERT INTO reviews
    (title, review_body, designer, category, owner)
    VALUES
    (%L)
    RETURNING review_id;
    `,
      [body.title, body.review_body, body.designer, body.category, body.owner]
    );

    const { rows: id } = await db.query(reviewsInsert);

    const { rows } = await db.query(
      `
    SELECT reviews.title, reviews.review_body, reviews.designer, reviews.category, reviews.owner, reviews.review_id, reviews.votes, reviews.created_at, COUNT(comments.review_id)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;
    `,
      [id[0].review_id]
    );

    return { newReview: rows[0] };
  }
};
