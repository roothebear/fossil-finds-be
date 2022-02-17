const request = require("supertest");
const { toBeSorted } = require("jest-sorted");
const app = require("../app.js");
const db = require("../db/connection.js");
const endpointsJson = require("../endpoints.json");

// set up database with test data
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
beforeEach(() => seed(testData));

// to close db connection once testing finished
afterAll(() => {
  if (db.end) db.end();
});

describe("/API", () => {
  // GET testing
  describe("GET /api/", () => {
    test("status: 200 - responds with endpoints.JSON", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(endpointsJson);
        });
    });
    describe("Error handling", () => {
      test("status: 404 - responds with err msg for a wrong path", () => {
        return request(app)
          .get("/incorrectpath")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("path not found");
          });
      });
    });
  });
});

// TOPICS

describe("/API/TOPICS", () => {
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
  // POST testing
  describe("POST /api/topics", () => {
    test("status: 201 - responds with article added", () => {
      return request(app)
        .post("/api/topics")
        .send({
          slug: "new topic",
          description: "new topic description",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).toEqual({
            slug: "new topic",
            description: "new topic description",
          });
        });
    });
    describe("Error handling", () => {
      test("status: 400 - error for invalid inputs (missing property)", () => {
        return request(app)
          .post("/api/topics")
          .send({
            description: "new topic description",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - null value given");
          });
      });
    });
  });
});

// ARTICLES

describe("/API/ARTICLES", () => {
  // GET testing
  describe("GET /api/articles", () => {
    test("status: 200 - responds with article object of default length 10 when no limit specified", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of articles
          expect(Object.keys(response.body)).toHaveLength(2);
          expect(Object.keys(response.body)[0]).toEqual("articles");
          expect(Object.keys(response.body)[1]).toEqual("totalCount");
          // check that array of article objects is the expected length
          expect(response.body.articles).toHaveLength(10);
          response.body.articles.forEach((article) => {
            expect(article).toEqual(
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
    });
    // comment counts
    test("status: 200 - articles include comment_count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          // make reference object for article comment counts
          let commentCountArray = {};
          response.body.articles.forEach((article) => {
            commentCountArray[article["article_id"]] = article["comment_count"];
          });
          expect(commentCountArray).toEqual({
            1: 11,
            2: 0,
            3: 2,
            4: 0,
            5: 2,
            6: 1,
            8: 0,
            9: 2,
            10: 0,
            12: 0,
          });
        });
    });
    // filtering by topic
    test("status: 200 - responds with articles with articles filtered by topic (topic exists)", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((response) => {
          // check that array of article objects is the expected length
          expect(response.body.articles).toHaveLength(10);
          response.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                topic: "mitch",
              })
            );
          });
        });
    });
    test("status: 200 - responds with empty array when topic exists but there are no matching articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toEqual([]);
        });
    });
    // sort_by query
    test("status: 200 - responds with article object with elements sorted by sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then((response) => {
          // check that array of article objects is in descending order by title
          let titles = response.body.articles.map((article) => {
            return article.title;
          });
          expect(titles).toBeSorted({ ascending: true });
        });
    });
    // order query
    test("status: 200 - responds with article object ordered by date created descending", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          // check that array of article objects is in descending order by age
          let dateCreated = response.body.articles.map((article) => {
            return article["created_at"];
          });
          expect(dateCreated).toBeSorted({ descending: true });
        });
    });
    // limit and offset queries
    test("status: 200 - responds with first 15 articles when limit and offset specified", () => {
      return request(app)
        .get("/api/articles?limit=7")
        .expect(200)
        .then((response) => {
          // check that array of article objects is in descending order by age
          let dateCreated = response.body.articles.map((article) => {
            return article["created_at"];
          });
          expect(dateCreated).toBeSorted({ descending: true });
          return response;
        })
        .then((response) => {
          // check that response object has a single key of articles
          expect(Object.keys(response.body)).toHaveLength(2);
          expect(Object.keys(response.body)[0]).toEqual("articles");
          // check that array of article objects is the expected length
          expect(response.body.articles).toHaveLength(7);
          response.body.articles.forEach((article) => {
            expect(article).toEqual(
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
    });
    describe("Error handling", () => {
      // test for topic existence when empty array
      test("status: 404 - responds with err msg when topic does not exist in database", () => {
        return request(app)
          .get("/api/articles?topic=bluepeter")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Topic not found");
          });
      });
      test("status: 400 - responds with err msg for invalid sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=nonexistentcolumn")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Error - Invalid sort_by or order query");
          });
      });
      test("status: 400 - responds with err msg for invalid order query", () => {
        return request(app)
          .get("/api/articles?order=nonsense")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Error - Invalid sort_by or order query");
          });
      });
      test("status: 400 - responds with err msg for invalid limit query", () => {
        return request(app)
          .get("/api/articles?limit=nonsense")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });

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
    test("status: 200 - responds with article including comment_count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of articles/1
          expect(Object.keys(response.body)).toHaveLength(1);
          expect(Object.keys(response.body)[0]).toEqual("article");
          expect(response.body.article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: 11,
          });
        });
    });
    describe("Error handling", () => {
      test("status: 404 - responds with not found for valid but non-existent article_id", () => {
        return request(app)
          .get("/api/articles/99")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("no article with this id exists");
          });
      });
      test("status: 400 - responds with bad request for invalid article_id", () => {
        return request(app)
          .get("/api/articles/invalidId")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    test("status: 200 - responds with comments object", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of comments
          expect(Object.keys(response.body)).toHaveLength(2);
          expect(Object.keys(response.body)[0]).toEqual("comments");
          expect(Object.keys(response.body)[1]).toEqual("commentCount");
          // check that array of comment objects is the expected length
          expect(response.body.comments).toHaveLength(10);
          response.body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
              })
            );
          });
        });
    });
    test("status: 200 - responds with comments object of correct length with limit query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5")
        .expect(200)
        .then((response) => {
          // check that array of comment objects is the expected length
          expect(response.body.comments).toHaveLength(5);
        });
    });
    test("status: 200 - responds with empty array when no comments exist for article", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual([]);
        });
    });
    describe("Error handling", () => {
      test("status: 400 - responds with err msg for invalid limit query", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=nonsense")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });

  // POST testing
  describe("POST /api/articles", () => {
    test("status: 201 - responds with article added", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "icellusedkars",
          title: "New title",
          body: "A new article",
          topic: "mitch",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toEqual({
            title: "New title",
            topic: "mitch",
            author: "icellusedkars",
            body: "A new article",
            created_at: expect.any(String),
            votes: 0,
            article_id: expect.any(Number),
            comment_count: 0,
          });
        });
    });
    describe("Error handling", () => {
      test("status: 400 - error for invalid inputs (author or topic does not exist)", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "invalidusername",
            title: "New title",
            body: "A new article",
            topic: "invalidtopic",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("status: 201 - responds with comment", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "icellusedkars", body: "A new comment" })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            article_id: 2,
            author: "icellusedkars",
            body: "A new comment",
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: 0,
          });
        });
    });
    describe("Error handling", () => {
      test("status: 400 - error for invalid username (not in user table)", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({ username: "invalidusername", body: "Hello" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });

  // PATCH testing
  describe("PATCH /api/articles/:article_id", () => {
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
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 112,
          });
        });
    });
    describe("Error handling", () => {
      test("status:400, no inc_votes on request body", () => {
        const articleUpdate = {
          irrelevant_key: "something irrelevant",
        };
        return request(app)
          .patch("/api/articles/2")
          .send(articleUpdate)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - null value given");
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
            expect(msg).toBe("error - invalid input");
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
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });

  // DELETE testing
  describe("DELETE /api/articles/:article_id", () => {
    test("status: 204 comment is deleted", () => {
      return request(app).delete("/api/articles/2").expect(204);
    });
    describe("Error handling", () => {
      test("400 - responds with bad request for invalid article id", () => {
        return request(app)
          .delete("/api/articles/invalidId")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
      test("404 - responds with not found for valid but non-existent article id", () => {
        return request(app)
          .delete("/api/articles/99")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("no article with this id exists");
          });
      });
    });
  });
});

// COMMENTS

describe("/API/COMMENTS", () => {
  // PATCH testing
  describe("PATCH /api/comments/:comment_id", () => {
    test("status:200, responds with the updated comment while ignoring any keys other than inc_votes", () => {
      const commentUpdate = {
        inc_votes: 12,
        irrelevant_key: "something irrelevant",
      };
      return request(app)
        .patch("/api/comments/1")
        .send(commentUpdate)
        .expect(200)
        .then((response) => {
          expect(response.body.comment).toEqual({
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 28,
            author: "butter_bridge",
            comment_id: 1,
            article_id: 9,
            created_at: "2020-04-06T12:17:00.000Z",
          });
        });
    });
    describe("Error handling", () => {
      test("status:400, no inc_votes on request body", () => {
        const commentUpdate = {
          irrelevant_key: "something irrelevant",
        };
        return request(app)
          .patch("/api/comments/2")
          .send(commentUpdate)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - null value given");
          });
      });
      test("status:404 invalid inc_votes provided (string)", () => {
        const commentUpdate = {
          inc_votes: "a string",
        };
        return request(app)
          .patch("/api/comments/3")
          .send(commentUpdate)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
      test("status:404 invalid inc_votes provided (boolean)", () => {
        const commentUpdate = {
          inc_votes: false,
        };
        return request(app)
          .patch("/api/comments/3")
          .send(commentUpdate)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });

  // DELETE testing
  describe("DELETE /api/comments/:comment_id", () => {
    test("status: 204 comment is deleted", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    describe("Error handling", () => {
      test("400 - responds with bad request for invalid comment id", () => {
        return request(app)
          .delete("/api/comments/invalidId")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
      test("404 - responds with not found for valid but non-existent comment id", () => {
        return request(app)
          .delete("/api/comments/99")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("no comment with this id exists");
          });
      });
    });
  });
});

// USERS

describe("/API/USERS", () => {
  // GET testing
  describe("GET /api/users", () => {
    test("status: 200 - responds with user object", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of users
          expect(Object.keys(response.body)).toHaveLength(1);
          expect(Object.keys(response.body)[0]).toEqual("users");
          // check that array of user objects is the expected length
          expect(response.body.users).toHaveLength(4);
          response.body.users.forEach((users) => {
            expect(users).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("GET /api/users/:username", () => {
    test("status: 200 - responds with user", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of articles/1
          expect(Object.keys(response.body)).toHaveLength(1);
          expect(Object.keys(response.body)[0]).toEqual("user");
          expect(response.body.user).toEqual(
            expect.objectContaining({
              username: "butter_bridge",
              name: "jonny",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            })
          );
        });
    });
    describe("Error handling", () => {
      test("status: 404 - responds with not found for valid but non-existent username", () => {
        return request(app)
          .get("/api/users/validusername")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("no user with this username exists");
          });
      });
    });
  });
});

// GENERAL

describe("PATH NOT FOUND", () => {
  describe("Error handling", () => {
    test("status: 404 - responds with path not found msg for incorrect path", () => {
      return request(app)
        .get("/api/not-an-endpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("path not found");
        });
    });
  });
});
