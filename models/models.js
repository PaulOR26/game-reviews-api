const db = require("../db/connection");

function selectCategories() {
  return db.query(`SELECT * FROM categories`).then((result) => {
    // console.log(result.rows);
    return { categories: result.rows };
  });
}

module.exports = { selectCategories };
