const db = require("../connection");

// extract any functions you are using to manipulate your data, into this file

function addCategories(categoryArray) {
  return categoryArray.map((catObj) => {
    return [catObj.slug, catObj.description];
  });
}

function addUsers(userArray) {
  return userArray.map((userObj) => {
    return [userObj.username, userObj.name, userObj.avatar_url];
  });
}

function addReviews(reviewArray) {
  return reviewArray.map((reviewObj) => {
    if (reviewObj.review_img_url === undefined) {
      reviewObj.review_img_url =
        "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg";
    }
    return [
      reviewObj.title,
      reviewObj.review_body,
      reviewObj.designer,
      reviewObj.review_img_url,
      reviewObj.votes,
      reviewObj.category,
      reviewObj.owner,
      reviewObj.created_at,
    ];
  });
}

function addComments(commentArray) {
  return commentArray.map((commentObj) => {
    return [
      commentObj.body,
      commentObj.belongs_to,
      commentObj.created_by,
      commentObj.votes,
      commentObj.created_at,
      //review_id
    ];
  });
}

module.exports = { addCategories, addUsers, addReviews, addComments };
