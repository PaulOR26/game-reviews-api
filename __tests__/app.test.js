const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET/api/categories', () => {
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

describe('GET/api/reviews/:review_id', () => {
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
  // test('Status 404: Returns error when specified review_id does not exist', async () => {
  //   const { body } = await request(app).get('api/reviews/14').expect(404);

  //   expect(body.msg).toBe('Requested review does not exist');
  // });
});
