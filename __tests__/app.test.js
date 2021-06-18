const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

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

describe('GET /api/reviews/:review_id', () => {
  test('Status 200: Returns specified review', async () => {
    const { body } = await request(app).get('/api/reviews/2').expect(200);

    expect(typeof body.review).toBe('object');

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

    expect(body.msg).toBe('Requested review does not exist');
  });
  test('Status 400: Returns error when specified review_id is not a number', async () => {
    const { body } = await request(app).get('/api/reviews/bad').expect(400);
    expect(body.msg).toBe('Review ID should be a number');

    const { body: body2 } = await request(app)
      .get('/api/reviews/£$^&*')
      .expect(400);
    expect(body2.msg).toBe('Review ID should be a number');
  });
});

describe('ALL /* Not Found', () => {
  test('Status 404: Path not recognised', async () => {
    const { body } = await request(app).get('/api/revieeeews').expect(404);

    expect(body.msg).toBe('Path not recognised');

    const { body: body2 } = await request(app).get('/eapi/rev').expect(404);

    expect(body2.msg).toBe('Path not recognised');
  });
});

describe('PATCH /api/reviews/:review_Id', () => {
  test('Status 200 - review modified', async () => {
    const reqBody = { inc_votes: '-1' };
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(200);

    expect(body.newVotes).toEqual(4);
  });
  test('Status 400 - returns error when votes not a number', async () => {
    const reqBody = { inc_votes: 'hello' };
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid input: value should be a whole number');
  });
  test('Status 400 - returns error when votes key incorrect', async () => {
    const reqBody = { votemjks: 3 };
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid input: vote key should be "inc_votes');
  });
  test('Status 400 - returns error when votes object empty', async () => {
    const reqBody = {};
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid input: no data submitted');
  });
  test('Status 400 - returns error when votes object has more than 1 key', async () => {
    const reqBody = { inc_votes: 3, something: 7 };
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe(
      'Invalid input: There should only be 1 vote key (inc_votes)'
    );
  });
});

describe('GET /api/reviews', () => {
  test('Status 200: sends back all reviews', async () => {
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
  test('Allows query for sort_by', async () => {
    const { body } = await request(app)
      .get('/api/reviews?sort_by=title')
      .expect(200);

    expect(body.reviews).toBeSortedBy('title', { descending: true });
  });
  test('Allows asc/desc order for sort_by query', async () => {
    const { body } = await request(app)
      .get('/api/reviews?sort_by=owner&order=desc')
      .expect(200);

    expect(body.reviews).toBeSortedBy('owner', { descending: true });
  });
  test('Allows category filter', async () => {
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
  test('status 400 sort_by column does not exist', async () => {
    const { body } = await request(app)
      .get('/api/reviews?order=desc&category=social deduction&sort_by=votlbes')
      .expect(400);

    expect(body.msg).toBe('Invalid input: sort_by column does not exist');
  });
  test('status 405 order !== asc or desc', async () => {
    const { body } = await request(app)
      .get('/api/reviews?order=dc&category=social deduction&sort_by=votes')
      .expect(405);

    expect(body.msg).toBe('Invalid input: order should be asc or desc');
  });
  test('status 400 category not in database', async () => {
    const { body } = await request(app)
      .get('/api/reviews?order=desc&category=sociction&sort_by=votes')
      .expect(400);

    expect(body.msg).toBe("Invalid input: category doesn't exist");
  });
  test('status 204 category exists but there are no associated reviews', async () => {
    const { body } = await request(app)
      .get("/api/reviews?order=desc&category=children's games&sort_by=votes")
      .expect(404);

    expect(body.msg).toBe('No reviews for selected category');
  });
});

describe('GET /api/reviews/:review_id/comments', () => {
  test('Status 200: sends back all comments for the specified review', async () => {
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
  test('Status 404: Returns error when specified review_id does not exist', async () => {
    const { body } = await request(app)
      .get('/api/reviews/14/comments')
      .expect(404);

    expect(body.msg).toBe('Requested review does not exist');
  });
});
