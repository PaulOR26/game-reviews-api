-- \c nc_games

-- SELECT * FROM reviews
-- LEFT JOIN comments
-- ON reviews.review_id = comments.review_id
-- WHERE comments.review_id = 100;

-- SELECT * FROM categories;
-- SELECT * FROM users;
-- SELECT * FROM reviews;
-- SELECT * FROM comments;

\c nc_games_test

-- SELECT * FROM categories;
-- SELECT * FROM users;
-- SELECT * FROM reviews;
-- SELECT * FROM comments;

-- SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body  FROM reviews
-- LEFT JOIN comments
-- ON reviews.review_id = comments.review_id
-- WHERE comments.review_id = 3
-- ;

SELECT reviews.*, COUNT(comments.review_id) AS comment_count
FROM reviews
LEFT JOIN comments
ON comments.review_id = reviews.review_id
-- WHERE reviews.review_id = 2
GROUP BY reviews.review_id
;

-- SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(comments.review_id)::INT AS comment_count 
-- FROM reviews
-- LEFT JOIN comments
-- ON comments.review_id = reviews.review_id
-- GROUP BY reviews.review_id
-- ORDER BY comment_count
-- ;