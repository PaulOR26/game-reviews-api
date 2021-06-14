// extract any functions you are using to manipulate your data, into this file

function addCategories(categoryArray) {
  return categoryArray.map((catObj) => {
    return [catObj.slug, catObj.description];
  });
}

module.exports = { addCategories };
