const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('ALL /* Not Found', () => {
  test('Status 404: Returns error Path not recognised', async () => {
    const { body } = await request(app).get('/api/revieeeews').expect(404);

    expect(body.msg).toBe('Path not recognised');

    const { body: body2 } = await request(app).get('/eapi/rev').expect(404);

    expect(body2.msg).toBe('Path not recognised');
  });
});

describe('GET /api', () => {
  test('Status 200: Returns JSON describing all the available endpoints on the API', async () => {
    const { body } = await request(app).get('/api').expect(200);

    for (const prop in body.endPoints) {
      expect(body.endPoints[prop]).toEqual(
        expect.objectContaining({
          description: expect.any(String),
          queries: expect.any(Array),
        })
      );
      expect(body.endPoints[prop]).toHaveProperty('exampleResponse');
    }
  });
});

describe('GET /api/categories', () => {
  test('Status 200 ', () => {
    return request(app).get('/api/categories').expect(200);
  });
  test('Returns all categories', async () => {
    const { body } = await request(app).get('/api/categories').expect(200);

    expect(body.categories).toHaveLength(4);

    body.categories.forEach((category) => {
      expect(category).toEqual(
        expect.objectContaining({
          slug: expect.any(String),
          description: expect.any(String),
        })
      );
    });
  });
});

describe('GET /api/reviews', () => {
  test('Status 200: Returns all reviews', async () => {
    const { body } = await request(app).get('/api/reviews').expect(200);

    expect(body.reviews).toHaveLength(13);

    body.reviews.forEach((review) => {
      expect(review).toEqual(
        expect.objectContaining({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: expect.any(Number),
          category: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        })
      );
    });
  });
  test('Status 200: Returns reviews sorted by query', async () => {
    const { body } = await request(app)
      .get('/api/reviews?sort_by=title')
      .expect(200);

    expect(body.reviews).toBeSortedBy('title', { descending: true });
  });
  test('Status 200: Returns reviews sorted in correct order', async () => {
    const { body } = await request(app)
      .get('/api/reviews?sort_by=owner&order=desc')
      .expect(200);

    expect(body.reviews).toBeSortedBy('owner', { descending: true });
  });
  test('Status 200: Returns reviews filtered by category', async () => {
    const { body } = await request(app)
      .get('/api/reviews?order=desc&category=social deduction&sort_by=votes')
      .expect(200);

    expect(body.reviews).toHaveLength(11);

    body.reviews.forEach((review) => {
      expect(review).toEqual(
        expect.objectContaining({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: expect.any(Number),
          category: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        })
      );
    });
  });
  test('status 400: sort_by column does not exist', async () => {
    const { body } = await request(app)
      .get('/api/reviews?order=desc&category=social deduction&sort_by=votlbes')
      .expect(400);

    expect(body.msg).toBe('Invalid input: sort_by column does not exist');
  });
  test('status 400: order !== asc or desc', async () => {
    const { body } = await request(app)
      .get('/api/reviews?order=dc&category=social deduction&sort_by=votes')
      .expect(400);

    expect(body.msg).toBe('Invalid input: order should be asc or desc');
  });
  test('status 400: category not in database', async () => {
    const { body } = await request(app)
      .get('/api/reviews?order=desc&category=sociction&sort_by=votes')
      .expect(400);

    expect(body.msg).toBe("Invalid input: category doesn't exist");
  });
  test('status 404: category exists but there are no associated reviews', async () => {
    const { body } = await request(app)
      .get("/api/reviews?order=desc&category=children's games&sort_by=votes")
      .expect(404);

    expect(body.msg).toBe('No reviews for selected category');
  });
});

describe('GET /api/reviews/:review_id', () => {
  test('Status 200: Returns specified review', async () => {
    const { body } = await request(app).get('/api/reviews/2').expect(200);

    expect(body.review).toBeInstanceOf(Object);

    expect(body.review).toEqual({
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
    });
  });
  test('Status 404: Returns error when specified review_id does not exist', async () => {
    const { body } = await request(app).get('/api/reviews/14').expect(404);

    expect(body.msg).toBe('Review does not exist');
  });
  test('Status 400: Returns error when specified review_id is not a number', async () => {
    const { body } = await request(app).get('/api/reviews/bad').expect(400);
    expect(body.msg).toBe('Invalid input: review_id should be a whole number');

    const { body: body2 } = await request(app)
      .get('/api/reviews/£$^&*')
      .expect(400);
    expect(body2.msg).toBe('Invalid input: review_id should be a whole number');
  });
});

describe('PATCH /api/reviews/:review_Id', () => {
  test('Status 200 - Returns modified review', async () => {
    const reqBody = { inc_votes: -1 };
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(200);

    expect(body.updatedReview).toBeInstanceOf(Object);

    expect(body.updatedReview).toEqual({
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
    });
  });
  test('Status 404: Returns error when specified review_id does not exist', async () => {
    const reqBody = { inc_votes: -1 };
    const { body } = await request(app)
      .patch('/api/reviews/14')
      .send(reqBody)
      .expect(404);

    expect(body.msg).toBe('Review does not exist');
  });
  test('Status 400: Returns error when specified review_id is not a number', async () => {
    const reqBody = { inc_votes: -1 };
    const { body } = await request(app)
      .patch('/api/reviews/bad')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid input: review_id should be a whole number');
  });
  test('Status 400 - Returns error when votes not a number', async () => {
    const reqBody = { inc_votes: 'hello' };
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid input: value should be a whole number');
  });
  test('Status 400 - Returns error when votes key incorrect', async () => {
    const reqBody = { votemjks: 3 };
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid input: vote key should be "inc_votes');
  });
  test('Status 400 - Returns error when votes object empty', async () => {
    const reqBody = {};
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid input: no data submitted');
  });
  test('Status 400 - Returns error when votes object has more than 1 key', async () => {
    const reqBody = { inc_votes: 3, something: 7 };
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe(
      'Invalid input: There should only be 1 vote key (inc_votes)'
    );
  });
  test("Doesn't mutate the given object", async () => {
    const reqBody = { inc_votes: -1 };
    await request(app).patch('/api/reviews/3').send(reqBody);

    expect(reqBody).toEqual({ inc_votes: -1 });
  });
});

describe('GET /api/reviews/:review_id/comments', () => {
  test('Status 200: Returns all comments for the specified review', async () => {
    const { body } = await request(app)
      .get('/api/reviews/3/comments')
      .expect(200);

    expect(body.comments).toHaveLength(3);

    body.comments.forEach((comment) => {
      expect(comment).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        })
      );
    });
  });
  test('Status 200: Responds with an empty array when valid id but no comments', async () => {
    const { body } = await request(app)
      .get('/api/reviews/4/comments')
      .expect(200);

    expect(body.comments).toEqual([]);
  });
  test('Status 404: Returns error when specified review_id does not exist', async () => {
    const { body } = await request(app)
      .get('/api/reviews/14/comments')
      .expect(404);

    expect(body.msg).toBe('Review does not exist');
  });
  test('Status 400: Returns error when specified review_id is not a number', async () => {
    const { body } = await request(app)
      .get('/api/reviews/bad/comments')
      .expect(400);
    expect(body.msg).toBe('Invalid input: review_id should be a whole number');

    const { body: body2 } = await request(app)
      .get('/api/reviews/£$^&*/comments')
      .expect(400);
    expect(body2.msg).toBe('Invalid input: review_id should be a whole number');
  });
});

describe('POST /api/reviews/:review_id/comments', () => {
  test('Status 201: Returns an object with the posted comment', async () => {
    const reqBody = {
      username: 'dav3rid',
      body: 'this is good',
    };
    const { body } = await request(app)
      .post('/api/reviews/11/comments')
      .send(reqBody)
      .expect(201);

    expect(body.newComment).toBe('this is good');

    const { rows } = await db.query(`
      SELECT * FROM comments
      WHERE comment_id = 7
      ;
      `);

    expect(rows[0]).toEqual(
      expect.objectContaining({
        comment_id: 7,
        votes: 0,
        created_at: expect.any(Date),
        author: 'dav3rid',
        body: 'this is good',
        review_id: 11,
      })
    );
  });
  test('Status 404: Returns error when specified review_id does not exist', async () => {
    const reqBody = {
      username: 'dav3rid',
      body: 'this is good',
    };
    const { body } = await request(app)
      .post('/api/reviews/14/comments')
      .send(reqBody)
      .expect(404);

    expect(body.msg).toBe('Review does not exist');
  });
  test('Status 400: Returns error when user does not exist', async () => {
    let reqBody = {
      username: 'david',
      body: 'this is good',
    };
    let { body } = await request(app)
      .post('/api/reviews/12/comments')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe(
      'Key (author)=(david) is not present in table "users".'
    );
  });
  test('Status 400: Returns error when object has missing key', async () => {
    const reqBody = {
      body: 'this is good',
    };
    const { body } = await request(app)
      .post('/api/reviews/12/comments')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe(
      'Invalid input: posted object should contain username and body keys'
    );
  });
  test('Status 400: Returns error when comment body is not a string', async () => {
    const reqBody = {
      username: 'dav3rid',
      body: 57,
    };
    const { body } = await request(app)
      .post('/api/reviews/12/comments')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid input: comment should be a string');
  });
  test("Doesn't mutate the given object", async () => {
    const reqBody = {
      username: 'dav3rid',
      body: 'this is good',
    };
    await request(app).post('/api/reviews/11/comments').send(reqBody);

    expect(reqBody).toEqual({
      username: 'dav3rid',
      body: 'this is good',
    });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('Status 204: Deletes comment and returns no content', async () => {
    const { body } = await request(app).delete('/api/comments/5').expect(204);

    expect(body).toEqual({});

    const { rows } = await db.query(`
    SELECT comment_id FROM comments;
    `);

    expect(rows).toHaveLength(5);

    expect(rows).toEqual(
      expect.arrayContaining([
        { comment_id: 1 },
        { comment_id: 2 },
        { comment_id: 3 },
        { comment_id: 4 },
        { comment_id: 6 },
      ])
    );
  });
  test('Status 404: Returns error when specified comment_id does not exist', async () => {
    const { body } = await request(app).delete('/api/comments/7').expect(404);

    expect(body.msg).toBe('Comment does not exist');
  });
  test('Status 400: Returns error when specified comment_id is not a number', async () => {
    const { body } = await request(app)
      .delete('/api/comments/sgsf')
      .expect(400);

    expect(body.msg).toBe('Invalid input: comment_id should be a whole number');
  });
});

describe('GET /api/users', () => {
  test('Status 200: Returns an array of user objects containing the username', async () => {
    const { body } = await request(app).get('/api/users').expect(200);

    expect(Array.isArray(body.users)).toBe(true);

    expect(body.users).toHaveLength(4);

    body.users.forEach((user) => {
      expect(user).toEqual(
        expect.objectContaining({
          username: expect.any(String),
        })
      );
    });
  });
});

describe('GET /api/users/:username', () => {
  test('Status 200: Returns requested user object', async () => {
    const { body } = await request(app)
      .get('/api/users/bainesface')
      .expect(200);

    expect(body.user).toEqual({
      username: 'bainesface',
      avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
      name: 'sarah',
    });
  });
  test('Status 404: Returns error when specified username does not exist', async () => {
    const { body } = await request(app).get('/api/users/bain123').expect(404);

    expect(body.msg).toBe('User does not exist');
  });
});

describe('PATCH /api/comments/:comment_id', () => {
  test('Status 200 - Returns modified comment', async () => {
    const reqBody = { inc_votes: 1 };
    const { body } = await request(app)
      .patch('/api/comments/6')
      .send(reqBody)
      .expect(200);

    expect(body.updatedComment).toBeInstanceOf(Object);

    expect(body.updatedComment).toEqual({
      comment_id: 6,
      author: 'philippaclaire9',
      review_id: 3,
      votes: 11,
      created_at: '2021-03-27T19:49:48.110Z',
      body: 'Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite',
    });
  });
  test('Status 400 - Returns error when votes not a number', async () => {
    const reqBody = { inc_votes: 'hello' };
    const { body } = await request(app)
      .patch('/api/comments/4')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid input: value should be a whole number');
  });
  test('Status 400 - Returns error when votes key incorrect', async () => {
    const reqBody = { votemjks: 3 };
    const { body } = await request(app)
      .patch('/api/comments/5')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid input: vote key should be "inc_votes');
  });
  test('Status 400 - Returns error when votes object empty', async () => {
    const reqBody = {};
    const { body } = await request(app)
      .patch('/api/comments/3')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid input: no data submitted');
  });
  test('Status 400 - Returns error when votes object has more than 1 key', async () => {
    const reqBody = { inc_votes: 3, something: 7 };
    const { body } = await request(app)
      .patch('/api/comments/2')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe(
      'Invalid input: There should only be 1 vote key (inc_votes)'
    );
  });
  test("Doesn't mutate the given object", async () => {
    const reqBody = { inc_votes: 1 };
    await request(app).patch('/api/comments/6').send(reqBody);

    expect(reqBody).toEqual({ inc_votes: 1 });
  });
});

describe('POST /api/reviews', () => {
  test('Status 201: Returns newly added review', async () => {
    const reqBody = {
      owner: 'dav3rid',
      title: 'Mario Kart',
      review_body: 'This is a fun game',
      designer: 'Nintendo',
      category: "children's games",
    };
    const { body } = await request(app)
      .post('/api/reviews')
      .send(reqBody)
      .expect(201);

    expect(body.newReview).toEqual(
      expect.objectContaining({
        owner: 'dav3rid',
        title: 'Mario Kart',
        review_body: 'This is a fun game',
        designer: 'Nintendo',
        category: "children's games",
        review_id: 14,
        votes: 0,
        created_at: expect.any(String),
        comment_count: 0,
      })
    );
  });
  test('Status 400: Returns error when object has missing key', async () => {
    const reqBody = {
      owner: 'dav3rid',
      title: 'Mario Kart',
      review_body: 'This is a fun game',
      category: "children's games",
    };
    const { body } = await request(app)
      .post('/api/reviews')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe(
      'Invalid input: posted object should include designer'
    );
  });
  test("Status 400: Returns error when values aren't all strings", async () => {
    const reqBody = {
      owner: 'dav3rid',
      title: 'Mario Kart',
      review_body: 3,
      designer: 'Nintendo',
      category: "children's games",
    };
    const { body } = await request(app)
      .post('/api/reviews')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe(
      'Invalid input: submitted data should be in string format'
    );
  });
  test("Doesn't mutate the given object", async () => {
    const reqBody = {
      owner: 'dav3rid',
      title: 'Mario Kart',
      review_body: 'This is a fun game',
      designer: 'Nintendo',
      category: "children's games",
    };
    await request(app).post('/api/reviews').send(reqBody);

    expect(reqBody).toEqual({
      owner: 'dav3rid',
      title: 'Mario Kart',
      review_body: 'This is a fun game',
      designer: 'Nintendo',
      category: "children's games",
    });
  });
});

describe('POST /api/categories', () => {
  test('Status 201: Returns newly added category', async () => {
    const reqBody = {
      slug: 'adventure',
      description:
        'Games that involve the player in an interactive story driven by exploring and/or problem solving',
    };
    const { body } = await request(app)
      .post('/api/categories')
      .send(reqBody)
      .expect(201);

    expect(body.newCategory).toEqual(
      expect.objectContaining({
        slug: 'adventure',
        description:
          'Games that involve the player in an interactive story driven by exploring and/or problem solving',
      })
    );
  });
  test('Status 400: Returns error when object has missing key', async () => {
    const reqBody = {
      description:
        'Games that involve the player in an interactive story driven by exploring and/or problem solving',
    };
    const { body } = await request(app)
      .post('/api/categories')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid input: posted object should include slug');
  });
  test("Status 400: Returns error when values aren't all strings", async () => {
    const reqBody = {
      slug: 7,
      description:
        'Games that involve the player in an interactive story driven by exploring and/or problem solving',
    };
    const { body } = await request(app)
      .post('/api/categories')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe(
      'Invalid input: submitted data should be in string format'
    );
  });
  test("Doesn't mutate the given object", async () => {
    const reqBody = {
      slug: 'adventure',
      description:
        'Games that involve the player in an interactive story driven by exploring and/or problem solving',
    };
    await request(app).post('/api/categories').send(reqBody);

    expect(reqBody).toEqual({
      slug: 'adventure',
      description:
        'Games that involve the player in an interactive story driven by exploring and/or problem solving',
    });
  });
});

describe('DELETE /api/reviews/:review_id', () => {
  test('Status 204: Deletes the specified review and returns no content', async () => {
    const { body } = await request(app).delete('/api/reviews/8').expect(204);

    expect(body).toEqual({});

    const { rows } = await db.query(`
    SELECT review_id FROM reviews;
    `);

    expect(rows).toHaveLength(12);

    expect(rows).toEqual(
      expect.arrayContaining([
        { review_id: 1 },
        { review_id: 2 },
        { review_id: 3 },
        { review_id: 4 },
        { review_id: 5 },
        { review_id: 6 },
        { review_id: 7 },
        { review_id: 9 },
        { review_id: 10 },
        { review_id: 11 },
        { review_id: 12 },
        { review_id: 13 },
      ])
    );
  });
  test('Status 404: Returns error when specified review_id does not exist', async () => {
    const { body } = await request(app).delete('/api/reviews/23').expect(404);

    expect(body.msg).toBe('Review does not exist');
  });
  test('Status 400: Returns error when specified review_id is not a number', async () => {
    const { body } = await request(app)
      .delete('/api/reviews/xxxxy')
      .expect(400);

    expect(body.msg).toBe('Invalid input: review_id should be a whole number');
  });
});
