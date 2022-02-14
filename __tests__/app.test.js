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
    test("status: 200 - responds with article", () => {
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
  describe("PATCH /api/articles/:article:_id", () => {
    // PATCH testing
    test("status:200, responds with the updated article while ignoring any keys other than inc_votes", () => {
      const articleUpdate = {
        inc_votes: 12,
        irrelevant_key: "something irrelevant",
      };
      return request(app)
        .patch("/api/articles/1")
        .send(articleUpdate)
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 112,
          });
        });
    });
    test("status:400, no inc_votes on request body", () => {
      const articleUpdate = {
        irrelevant_key: "something irrelevant",
      };
      return request(app)
        .patch("/api/articles/2")
        .send(articleUpdate)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("null value in body violates not-null constraint");
        });
    });
    test("status:404 invalid inc_votes provided (string)", () => {
      const articleUpdate = {
        inc_votes: "a string",
      };
      return request(app)
        .patch("/api/articles/3")
        .send(articleUpdate)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(`invalid input syntax for type integer`);
        });
    });
    test("status:404 invalid inc_votes provided (boolean)", () => {
      const articleUpdate = {
        inc_votes: false,
      };
      return request(app)
        .patch("/api/articles/3")
        .send(articleUpdate)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(`invalid input syntax for type integer`);
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
