const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");

// set up database with test data
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
beforeEach(() => seed(testData));

// to close db connection once testing finished
afterAll(() => {
  if (db.end) db.end();
});

describe("/api", () => {
  // GET testing
  describe("GET /api", () => {
    test("status: 200 - responds with all ok message", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({ msg: "all ok" });
        });
    });
  });
});

// TOPICS

describe("/api/topics", () => {
  // GET testing
  describe("GET /api/topics", () => {
    test("status: 200 - responds with topic object", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of topics
          expect(Object.keys(response.body)).toHaveLength(1);
          expect(Object.keys(response.body)[0]).toEqual("topics");
          // check that array of topic objects is the expected length
          expect(response.body.topics).toHaveLength(3);
          response.body.topics.forEach((topics) => {
            expect(topics).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
  });
});

// ARTICLES

describe("/api/articles", () => {
  // GET testing
  describe("GET /api/articles/:article_id", () => {
    test("status: 200 - responds with article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of articles/1
          expect(Object.keys(response.body)).toHaveLength(1);
          expect(Object.keys(response.body)[0]).toEqual("article");
          expect(response.body.article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
    test("status: 404 - responds with err msg for valid but non-existent article_id", () => {
      return request(app)
        .get("/api/articles/99")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("no article with this id exists");
        });
    });
  });
});

describe("Server - paths not found", () => {
  test("status: 404 - responds with path not found msg for incorrect path", () => {
    return request(app)
      .get("/api/not-an-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});
