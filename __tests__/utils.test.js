const { addCategories } = require("../db/utils/data-manipulation");

describe("addCategories", () => {
  test("Returns an empty array when passed an empty array", () => {
    const actual = addCategories([]);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  test("Returns a single nested array when passed an array with one object", () => {
    const categoryArray = [
      {
        slug: "euro game",
        description: "Abstact games that involve little luck",
      },
    ];

    const actual = addCategories(categoryArray);

    const expected = [["euro game", "Abstact games that involve little luck"]];
    expect(actual).toEqual(expected);
  });
  test("Returns a nested array for each row to be added when passed an array with multiple objects", () => {
    const categoryArray = [
      {
        slug: "euro game",
        description: "Abstact games that involve little luck",
      },
      {
        slug: "social deduction",
        description: "Players attempt to uncover each other's hidden role",
      },
      { slug: "dexterity", description: "Games involving physical skill" },
      { slug: "children's games", description: "Games suitable for children" },
    ];

    const actual = addCategories(categoryArray);

    const expected = [
      ["euro game", "Abstact games that involve little luck"],
      [
        "social deduction",
        "Players attempt to uncover each other's hidden role",
      ],
      ["dexterity", "Games involving physical skill"],
      ["children's games", "Games suitable for children"],
    ];
    expect(actual).toEqual(expected);
  });
});
