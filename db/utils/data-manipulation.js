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
    return [
      reviewObj.title,
      reviewObj.designer,
      reviewObj.owner,
      reviewObj.review_body,
      reviewObj.category,
      reviewObj.created_at,
      reviewObj.votes,
      reviewObj.review_img_url,
    ];
  });
}
module.exports = { addCategories, addUsers, addReviews };
