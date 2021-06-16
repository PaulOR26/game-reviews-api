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
    });
  });
  test('Status 404: Returns error when specified review_id does not exist', async () => {
    const { body } = await request(app).get('/api/reviews/14').expect(404);

    expect(body.msg).toBe('Requested review does not exist');
  });
  test('Status 400: Returns error when specified review_id is not a number', async () => {
    const { body } = await request(app).get('/api/reviews/bad').expect(400);
    expect(body.msg).toBe('Invalid input');

    const { body: body2 } = await request(app)
      .get('/api/reviews/£$^&*')
      .expect(400);
    expect(body2.msg).toBe('Invalid input');
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
    const reqBody = { votes: '-1' };
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(200);

    expect(body.newVotes).toEqual(4);
  });
  test('Status 400 - returns error when votes not a number', async () => {
    const reqBody = { votes: 'hello' };
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid vote value');
  });
  test('Status 400 - returns error when votes key incorrect', async () => {
    const reqBody = { votemjks: 3 };
    const { body } = await request(app)
      .patch('/api/reviews/3')
      .send(reqBody)
      .expect(400);

    expect(body.msg).toBe('Invalid vote key');
  });
});
