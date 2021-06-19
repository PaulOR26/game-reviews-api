module.exports = {
  'GET /api': {
    description:
      'serves up a json representation of all the available endpoints of the api',
    queries: [],
    exampleResponse: 'this',
  },
  'GET /api/categories': {
    description: 'serves an array of all categories',
    queries: [],
    exampleResponse: {
      categories: [
        {
          description: "Players attempt to uncover each other's hidden role",
          slug: 'Social deduction',
        },
      ],
    },
  },
  'GET /api/reviews': {
    description: 'serves an array of all reviews including comment counts',
    queries: ['category', 'sort_by', 'order'],
    exampleResponse: {
      reviews: [
        {
          title: 'One Night Ultimate Werewolf',
          owner: 'happyamy2016',
          review_id: 2,
          review_img_url:
            'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
          category: 'hidden-roles',
          created_at: '2021-01-25T11:16:54.963Z',
          votes: 5,
          comment_count: 3,
        },
      ],
    },
  },
  'GET /api/reviews/:review_id': {
    description: 'serves a review object including comment count',
    queries: [],
    exampleResponse: {
      review_id: 2,
      title: 'Jenga',
      review_body: 'Fiddly fun for all the family',
      designer: 'Leslie Scott',
      review_img_url:
        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
      votes: 5,
      category: 'dexterity',
      owner: 'philippaclaire9',
      created_at: '2021-01-18T10:01:41.251Z',
      comment_count: 3,
    },
  },
  'PATCH /api/reviews/:review_Id': {
    description: 'serves a review object with updated votes',
    queries: [],
    exampleResponse: {
      review_id: 3,
      title: 'Ultimate Werewolf',
      review_body: "We couldn't find the werewolf!",
      designer: 'Akihisa Okui',
      review_img_url:
        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
      votes: 4,
      category: 'social deduction',
      owner: 'bainesface',
      created_at: '2021-01-18T10:01:41.251Z',
    },
  },
  'GET /api/reviews/:review_id/comments': {
    description: 'serves an array of comments for the specified review',
    queries: [],
    exampleResponse: [
      {
        comment_id: 2,
        votes: 13,
        created_at: '2021-01-18T10:09:05.410Z',
        author: 'mallionaire',
        body: 'My dog loved this game too!',
      },
    ],
  },
  'POST /api/reviews/:review_id/comments': {
    description: 'serves the new comment',
    queries: [],
    exampleResponse: 'this is a new comment',
  },
};
