const db = require('../connection');
const format = require('pg-format');
const {
  addCategories,
  addUsers,
  addReviews,
  addComments,
} = require('../utils/data-manipulation');

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // console.log(categoryData);
  // 1. create tables
  await db.query('DROP TABLE IF EXISTS comments;');
  await db.query('DROP TABLE IF EXISTS reviews;');
  await db.query('DROP TABLE IF EXISTS categories;');
  await db.query('DROP TABLE IF EXISTS users;');

  await db.query(`CREATE TABLE categories (
    slug VARCHAR(200) PRIMARY KEY,
    description TEXT NOT NULL
    );`);

  await db.query(`CREATE TABLE users (
      username VARCHAR(100) PRIMARY KEY,
      avatar_url VARCHAR(200),
      name VARCHAR(100)
      );`);

  await db.query(`CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    title VARCHAR(200) UNIQUE NOT NULL,
    review_body VARCHAR(1000) NOT NULL,
    designer VARCHAR(100),
    review_img_url VARCHAR(200) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
    votes INT DEFAULT 0,
    category VARCHAR(200) REFERENCES categories(slug),
    owner VARCHAR(100) REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );`);

  await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR(100) REFERENCES users(username),
    review_id INT NOT NULL,
    votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    body VARCHAR(300) NOT NULL
    );`);

  // 2. insert data

  const categoriesInsert = format(
    `
    INSERT INTO categories
    (slug, description)
    VALUES
    %L
    RETURNING *;
    `,
    addCategories(categoryData)
  );

  await db.query(categoriesInsert);

  const usersInsert = format(
    `INSERT INTO users
    (username, name, avatar_url)
    VALUES
    %L
    RETURNING *;
    `,
    addUsers(userData)
  );

  await db.query(usersInsert);

  const reviewsInsert = format(
    `INSERT INTO reviews
    (title, review_body, designer, review_img_url, votes, category, owner, created_at)
    VALUES
    %L
    RETURNING *;
    `,
    addReviews(reviewData)
  );

  const reference = await db.query(reviewsInsert);

  const commentsInsert = format(
    `
    INSERT INTO comments
    (author, review_id, votes, created_at, body)
    VALUES
    %L
    RETURNING *
    `,
    addComments(commentData, reference)
  );

  await db.query(commentsInsert);
};

module.exports = seed;
