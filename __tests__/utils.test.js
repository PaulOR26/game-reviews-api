const {
  addCategories,
  addUsers,
  addReviews,
  addComments,
} = require("../db/utils/data-manipulation");

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

describe("addUsers", () => {
  test("returns an empty array when passed an empty array", () => {
    const actual = addUsers([]);
    const expected = [];
    expect(actual).toEqual(expected);
  });

  test("Returns a single nested array when passed an array with one object", () => {
    const userArray = [
      {
        username: "mallionaire",
        name: "haz",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
    ];

    const actual = addUsers(userArray);

    const expected = [
      [
        "mallionaire",
        "haz",
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      ],
    ];
    expect(actual).toEqual(expected);
  });

  test("Returns an array with multiple arrays when passed an array with multiple objects", () => {
    const userArray = [
      {
        username: "mallionaire",
        name: "haz",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "philippaclaire9",
        name: "philippa",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
    ];

    const actual = addUsers(userArray);

    const expected = [
      [
        "mallionaire",
        "haz",
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      ],
      [
        "philippaclaire9",
        "philippa",
        "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      ],
    ];
    expect(actual).toEqual(expected);
  });
});

describe("addReviews", () => {
  test("returns an empty array when passed an empty array", () => {
    const actual = addReviews([]);
    const expected = [];
    expect(actual).toEqual(expected);
  });

  test("Returns a single nested array when passed an array with one object", () => {
    const reviewArray = [
      {
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: new Date(1610964020514),
        votes: 1,
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
    ];

    const actual = addReviews(reviewArray);

    const expected = [
      [
        "Agricola",
        "Farmyard fun!",
        "Uwe Rosenberg",
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        1,
        "euro game",
        "mallionaire",
        new Date(1610964020514),
      ],
    ];
    expect(actual).toEqual(expected);
  });

  test("Returns an array with multpiple arrays when passed an array with multiple objects", () => {
    const reviewArray = [
      {
        title: "Agricola",
        review_body: "Farmyard fun!",
        designer: "Uwe Rosenberg",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        votes: 1,
        category: "euro game",
        owner: "mallionaire",
        created_at: new Date(1610964020514),
      },
      {
        title: "Jenga",
        review_body: "Fiddly fun for all the family",
        designer: "Leslie Scott",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        votes: 5,
        category: "dexterity",
        owner: "philippaclaire9",
        created_at: new Date(1610964101251),
      },
    ];

    const actual = addReviews(reviewArray);

    const expected = [
      [
        "Agricola",
        "Farmyard fun!",
        "Uwe Rosenberg",
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        1,
        "euro game",
        "mallionaire",
        new Date(1610964020514),
      ],
      [
        "Jenga",
        "Fiddly fun for all the family",
        "Leslie Scott",
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        5,
        "dexterity",
        "philippaclaire9",
        new Date(1610964101251),
      ],
    ];
    expect(actual).toEqual(expected);
  });
});

describe("addComments", () => {
  test("returns an empty array when passed an empty array", () => {
    const actual = addComments([]);
    const expected = [];
    expect(actual).toEqual(expected);
  });
  test("Returns a single nested array when passed an array with one object", () => {
    const commentArray = [
      {
        body: "I loved this game too!",
        belongs_to: "Jenga",
        created_by: "bainesface",
        votes: 16,
        created_at: new Date(1511354613389),
      },
    ];

    const actual = addComments(commentArray, {
      rows: [{ title: "Jenga", review_id: 2 }],
    });

    const expected = [
      ["bainesface", 2, 16, new Date(1511354613389), "I loved this game too!"],
    ];
    expect(actual).toEqual(expected);
  });
  test("Returns an array with multpiple arrays when passed an array with multiple objects", () => {
    const commentArray = [
      {
        body: "I loved this game too!",
        belongs_to: "Jenga",
        created_by: "bainesface",
        votes: 16,
        created_at: new Date(1511354613389),
      },
      {
        body: "My dog loved this game too!",
        belongs_to: "Ultimate Werewolf",
        created_by: "mallionaire",
        votes: 13,
        created_at: new Date(1610964545410),
      },
    ];

    const actual = addComments(commentArray, {
      rows: [
        { title: "Jenga", review_id: 2 },
        { title: "Ultimate Werewolf", review_id: 3 },
      ],
    });

    const expected = [
      ["bainesface", 2, 16, new Date(1511354613389), "I loved this game too!"],

      [
        "mallionaire",
        3,
        13,
        new Date(1610964545410),
        "My dog loved this game too!",
      ],
    ];
    expect(actual).toEqual(expected);
  });
});
