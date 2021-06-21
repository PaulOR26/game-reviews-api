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
          slug: 'Social deduction',
          description: "Players attempt to uncover each other's hidden role",
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
          category: 'hidden-roles',
          owner: 'happyamy2016',
          review_img_url:
            'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
          created_at: '2021-01-25T11:16:54.963Z',
          review_id: 2,
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
      review: {
        title: 'Jenga',
        category: 'dexterity',
        review_body: 'Fiddly fun for all the family',
        owner: 'philippaclaire9',
        designer: 'Leslie Scott',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        created_at: '2021-01-18T10:01:41.251Z',
        review_id: 2,
        votes: 5,
        comment_count: 3,
      },
    },
  },
  'PATCH /api/reviews/:review_Id': {
    description: 'serves a review object with updated votes',
    queries: [],
    exampleResponse: {
      updatedReview: {
        title: 'Ultimate Werewolf',
        category: 'social deduction',
        review_body: "We couldn't find the werewolf!",
        owner: 'bainesface',
        review_img_url:
          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
        designer: 'Akihisa Okui',
        created_at: '2021-01-18T10:01:41.251Z',
        review_id: 3,
        votes: 4,
      },
    },
  },
  'GET /api/reviews/:review_id/comments': {
    description: 'serves an array of comments for the specified review',
    queries: [],
    exampleResponse: {
      comments: [
        {
          author: 'mallionaire',
          body: 'My dog loved this game too!',
          created_at: '2021-01-18T10:09:05.410Z',
          comment_id: 2,
          votes: 13,
        },
      ],
    },
  },
  'POST /api/reviews/:review_id/comments': {
    description: 'serves the new comment',
    queries: [],
    exampleResponse: { newComment: 'this is a new comment' },
  },
  'DELETE /api/comments/:comment_id': {
    description: 'serves status 204 with no content',
    queries: [],
    exampleResponse: 204,
  },
  'GET /api/users': {
    description: 'serves an array of all users',
    queries: [],
    exampleResponse: {
      users: [{ username: 'mallionaire' }, { username: 'philippaclaire9' }],
    },
  },
  'GET /api/users/:username': {
    description: 'serves the requested user object',
    queries: [],
    exampleResponse: {
      user: {
        username: 'bainesface',
        name: 'sarah',
        avatar_url:
          'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
      },
    },
  },
  'PATCH /api/comments/:comment_id': {
    description: 'serves a comment object with updated votes',
    queries: [],
    exampleResponse: {
      updatedComment: {
        author: 'philippaclaire9',
        body: 'Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite',
        created_at: '2021-03-27T19:49:48.110Z',
        comment_id: 6,
        review_id: 3,
        votes: 11,
      },
    },
  },
  'POST /api/reviews': {
    description: 'serves the newly added review',
    queries: [],
    exampleResponse: {
      newReview: {
        title: 'Mario Kart',
        review_body: 'This is a fun game',
        category: "children's games",
        owner: 'dav3rid',
        designer: 'Nintendo',
        created_at: '2021-06-21T07:51:50.906Z',
        review_id: 14,
        votes: 0,
        comment_count: 0,
      },
    },
  },
};
