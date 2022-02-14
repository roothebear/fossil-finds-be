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
