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

// TYPES

describe("/API/TYPES", () => {
  // GET testing
  describe("GET /api/types", () => {
    test("status: 200 - responds with type object", () => {
      return request(app)
        .get("/api/types")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of types
          expect(Object.keys(response.body)).toHaveLength(1);
          expect(Object.keys(response.body)[0]).toEqual("types");
          // check that array of type objects is the expected length
          expect(response.body.types).toHaveLength(4);
          response.body.types.forEach((types) => {
            expect(types).toEqual(
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
  describe("POST /api/types", () => {
    test("status: 201 - responds with find added", () => {
      return request(app)
        .post("/api/types")
        .send({
          slug: "new type",
          description: "new type description",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.type).toEqual({
            slug: "new type",
            description: "new type description",
          });
        });
    });
    describe("Error handling", () => {
      test("status: 400 - error for invalid inputs (missing property)", () => {
        return request(app)
          .post("/api/types")
          .send({
            description: "new type description",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - null value given");
          });
      });
    });
  });
});

// LOCATIONS

describe("/API/LOCATIONS", () => {
  // GET testing
  describe("GET /api/locations", () => {
    test("status: 200 - responds with location object", () => {
      return request(app)
        .get("/api/locations")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of locations
          expect(Object.keys(response.body)).toHaveLength(1);
          expect(Object.keys(response.body)[0]).toEqual("locations");
          // check that array of location objects is the expected length
          expect(response.body.locations).toHaveLength(3);
          response.body.locations.forEach((locations) => {
            expect(locations).toEqual(
              expect.objectContaining({
                location_id: expect.any(Number),
                settlement: expect.any(String),
                county: expect.any(String),
              })
            );
          });
        });
    });
  });
  // POST testing
  describe("POST /api/locations", () => {
    test("status: 201 - responds with location added", () => {
      return request(app)
        .post("/api/locations")
        .send({
          settlement: "new settlement",
          county: "new county",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.location).toEqual({
            location_id: expect.any(Number),
            settlement: "new settlement",
            county: "new county",
          });
        });
    });
    describe("Error handling", () => {
      test("status: 400 - error for invalid inputs (missing property)", () => {
        return request(app)
          .post("/api/locations")
          .send({
            settlement: "new settlement",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - null value given");
          });
      });
    });
  });
});

// FINDS

describe("/API/FINDS", () => {
  // GET testing
  describe("GET /api/finds", () => {
    test("status: 200 - responds with find object of default length 10 when no limit specified", () => {
      return request(app)
        .get("/api/finds")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of finds
          expect(Object.keys(response.body)).toHaveLength(2);
          expect(Object.keys(response.body)[0]).toEqual("finds");
          expect(Object.keys(response.body)[1]).toEqual("totalCount");
          // check that array of find objects is the expected length
          expect(response.body.finds).toHaveLength(10);
          response.body.finds.forEach((find) => {
            expect(find).toEqual(
              expect.objectContaining({
                find_id: expect.any(Number),
                title: expect.any(String),
                type: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                img_url: expect.any(String),
                latitude: expect.any(Number),
                longitude: expect.any(Number),
                created_at: expect.any(String),
                likes: expect.any(Number),
              })
            );
          });
        });
    });
    // comment counts
    test("status: 200 - finds include comment_count", () => {
      return request(app)
        .get("/api/finds?limit=12")
        .expect(200)
        .then((response) => {
          // make reference object for find comment counts
          let commentCountArray = {};
          response.body.finds.forEach((find) => {
            commentCountArray[find["find_id"]] = find["comment_count"];
          });
          expect(commentCountArray).toEqual({
            1: 8,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
          });
        });
    });
    // filtering by type
    test("status: 200 - responds with finds with finds filtered by type (type exists)", () => {
      return request(app)
        .get("/api/finds?type=type_a")
        .expect(200)
        .then((response) => {
          // check that array of find objects is the expected length
          expect(response.body.finds).toHaveLength(10);
          response.body.finds.forEach((find) => {
            expect(find).toEqual(
              expect.objectContaining({
                type: "type_a",
              })
            );
          });
        });
    });
    test("status: 200 - responds with empty array when type exists but there are no matching finds", () => {
      return request(app)
        .get("/api/finds?type=type_c")
        .expect(200)
        .then((response) => {
          expect(response.body.finds).toEqual([]);
        });
    });
    // sort_by query
    test("status: 200 - responds with find object with elements sorted by sort_by query", () => {
      return request(app)
        .get("/api/finds?sort_by=title&order=asc")
        .expect(200)
        .then((response) => {
          // check that array of find objects is in descending order by title
          let titles = response.body.finds.map((find) => {
            return find.title;
          });
          expect(titles).toBeSorted({ ascending: true });
        });
    });
    // order query
    test("status: 200 - responds with find object ordered by date created descending", () => {
      return request(app)
        .get("/api/finds")
        .expect(200)
        .then((response) => {
          // check that array of find objects is in descending order by age
          let dateCreated = response.body.finds.map((find) => {
            return find["created_at"];
          });
          expect(dateCreated).toBeSorted({ descending: true });
        });
    });
    // limit and offset queries
    test("status: 200 - responds with first 15 finds when limit and offset specified", () => {
      return request(app)
        .get("/api/finds?limit=7")
        .expect(200)
        .then((response) => {
          // check that array of find objects is in descending order by age
          let dateCreated = response.body.finds.map((find) => {
            return find["created_at"];
          });
          expect(dateCreated).toBeSorted({ descending: true });
          return response;
        })
        .then((response) => {
          // check that response object has a single key of finds
          expect(Object.keys(response.body)).toHaveLength(2);
          expect(Object.keys(response.body)[0]).toEqual("finds");
          // check that array of find objects is the expected length
          expect(response.body.finds).toHaveLength(7);
          response.body.finds.forEach((find) => {
            expect(find).toEqual(
              expect.objectContaining({
                find_id: expect.any(Number),
                title: expect.any(String),
                type: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                location_id: expect.any(Number),
                settlement: expect.any(String),
                county: expect.any(String),
                img_url: expect.any(String),
                latitude: expect.any(Number),
                longitude: expect.any(Number),
                created_at: expect.any(String),
                likes: expect.any(Number),
              })
            );
          });
        });
    });
    describe("Error handling", () => {
      // test for type existence when empty array
      test("status: 404 - responds with err msg when type does not exist in database", () => {
        return request(app)
          .get("/api/finds?type=bluepeter")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("type not found");
          });
      });
      test("status: 400 - responds with err msg for invalid sort_by query", () => {
        return request(app)
          .get("/api/finds?sort_by=nonexistentcolumn")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Error - Invalid sort_by or order query");
          });
      });
      test("status: 400 - responds with err msg for invalid order query", () => {
        return request(app)
          .get("/api/finds?order=nonsense")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Error - Invalid sort_by or order query");
          });
      });
      test("status: 400 - responds with err msg for invalid limit query", () => {
        return request(app)
          .get("/api/finds?limit=nonsense")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });

  describe("GET /api/finds/:find_id", () => {
    test("status: 200 - responds with find", () => {
      return request(app)
        .get("/api/finds/1")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of finds/1
          expect(Object.keys(response.body)).toHaveLength(1);
          expect(Object.keys(response.body)[0]).toEqual("find");
          expect(response.body.find).toEqual(
            expect.objectContaining({
              find_id: expect.any(Number),
              title: expect.any(String),
              type: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              location_id: expect.any(Number),
              settlement: expect.any(String),
              county: expect.any(String),
              img_url: expect.any(String),
              latitude: expect.any(Number),
              longitude: expect.any(Number),
              created_at: expect.any(String),
              likes: expect.any(Number),
            })
          );
        });
    });
    test("status: 200 - responds with find including comment_count", () => {
      return request(app)
        .get("/api/finds/1")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of finds/1
          expect(Object.keys(response.body)).toHaveLength(1);
          expect(Object.keys(response.body)[0]).toEqual("find");
          expect(response.body.find).toEqual({
            find_id: 1,
            title: "title_a",
            type: "type_a",
            author: "username_a",
            body: "body_a",
            location_id: expect.any(Number),
            settlement: "Lyme Regis",
            county: "Dorset",
            img_url: expect.any(String),
            latitude: expect.any(Number),
            longitude: expect.any(Number),
            created_at: "2020-07-09T20:11:00.000Z",
            likes: 12,
            comment_count: 8,
          });
        });
    });
    describe("Error handling", () => {
      test("status: 404 - responds with not found for valid but non-existent find_id", () => {
        return request(app)
          .get("/api/finds/99")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("no find with this id exists");
          });
      });
      test("status: 400 - responds with bad request for invalid find_id", () => {
        return request(app)
          .get("/api/finds/invalidId")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });

  describe("GET /api/finds/:find_id/comments", () => {
    test("status: 200 - responds with comments object", () => {
      return request(app)
        .get("/api/finds/1/comments")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of comments
          expect(Object.keys(response.body)).toHaveLength(2);
          expect(Object.keys(response.body)[0]).toEqual("comments");
          expect(Object.keys(response.body)[1]).toEqual("commentCount");
          // check that array of comment objects is the expected length
          expect(response.body.comments).toHaveLength(8);
          response.body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                likes: expect.any(Number),
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
        .get("/api/finds/1/comments?limit=5")
        .expect(200)
        .then((response) => {
          // check that array of comment objects is the expected length
          expect(response.body.comments).toHaveLength(5);
        });
    });
    test("status: 200 - responds with empty array when no comments exist for find", () => {
      return request(app)
        .get("/api/finds/2/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual([]);
        });
    });
    describe("Error handling", () => {
      test("status: 400 - responds with err msg for invalid limit query", () => {
        return request(app)
          .get("/api/finds/1/comments?limit=nonsense")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });

  // POST testing
  describe("POST /api/finds", () => {
    test("status: 201 - responds with find added", () => {
      return request(app)
        .post("/api/finds")
        .send({
          author: "username_a",
          title: "New title",
          body: "A new find",
          img_url: "url_string",
          location_id: 1,
          latitude: 53.39159,
          longitude: -1.434896,
          type: "type_a",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.find).toEqual({
            title: "New title",
            type: "type_a",
            author: "username_a",
            body: "A new find",
            img_url: "url_string",
            location_id: 1,
            settlement: "Lyme Regis",
            county: "Dorset",
            latitude: 53.39159,
            longitude: -1.434896,
            created_at: expect.any(String),
            likes: 0,
            find_id: expect.any(Number),
            comment_count: 0,
          });
        });
    });
    describe("Error handling", () => {
      test("status: 400 - error for invalid inputs (author or type does not exist)", () => {
        return request(app)
          .post("/api/finds")
          .send({
            author: "invalidusername",
            title: "New title",
            body: "A new find",
            img_url: "url_string",
            location_id: 1,
            latitude: 53.391589,
            longitude: -1.434896,
            type: "invalidtype",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });
  describe("POST /api/finds/:find_id/comments", () => {
    test("status: 201 - responds with comment", () => {
      return request(app)
        .post("/api/finds/2/comments")
        .send({ username: "username_b", body: "A new comment" })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            find_id: 2,
            author: "username_b",
            body: "A new comment",
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            likes: 0,
          });
        });
    });
    describe("Error handling", () => {
      test("status: 400 - error for invalid username (not in user table)", () => {
        return request(app)
          .post("/api/finds/2/comments")
          .send({ username: "invalidusername", body: "Hello" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });

  // PATCH testing
  describe("PATCH /api/finds/:find_id", () => {
    test("status:200, responds with the updated find while ignoring any keys other than inc_likes", () => {
      const findUpdate = {
        inc_likes: 12,
        irrelevant_key: "something irrelevant",
      };
      return request(app)
        .patch("/api/finds/1")
        .send(findUpdate)
        .expect(200)
        .then((response) => {
          expect(response.body.find).toEqual({
            find_id: 1,
            title: "title_a",
            type: "type_a",
            author: "username_a",
            body: "body_a",
            location_id: 1,
            latitude: 53.39159,
            longitude: -1.434896,
            img_url: "url_string",
            created_at: "2020-07-09T20:11:00.000Z",
            likes: 24,
          });
        });
    });
    describe("Error handling", () => {
      test("status:400, no inc_likes on request body", () => {
        const findUpdate = {
          irrelevant_key: "something irrelevant",
        };
        return request(app)
          .patch("/api/finds/2")
          .send(findUpdate)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - null value given");
          });
      });
      test("status:404 invalid inc_likes provided (string)", () => {
        const findUpdate = {
          inc_likes: "a string",
        };
        return request(app)
          .patch("/api/finds/3")
          .send(findUpdate)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
      test("status:404 invalid inc_likes provided (boolean)", () => {
        const findUpdate = {
          inc_likes: false,
        };
        return request(app)
          .patch("/api/finds/3")
          .send(findUpdate)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
    });
  });

  // DELETE testing
  describe("DELETE /api/finds/:find_id", () => {
    test("status: 204 find is deleted", () => {
      return request(app).delete("/api/finds/3").expect(204);
    });
    describe("Error handling", () => {
      test("400 - responds with bad request for invalid find id", () => {
        return request(app)
          .delete("/api/finds/invalidId")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
      test("404 - responds with not found for valid but non-existent find id", () => {
        return request(app)
          .delete("/api/finds/99")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("no find with this id exists");
          });
      });
    });
  });
});

// COMMENTS

describe("/API/COMMENTS", () => {
  // PATCH testing
  describe("PATCH /api/comments/:comment_id", () => {
    test("status:200, responds with the updated comment while ignoring any keys other than inc_likes", () => {
      const commentUpdate = {
        inc_likes: 12,
        irrelevant_key: "something irrelevant",
      };
      return request(app)
        .patch("/api/comments/1")
        .send(commentUpdate)
        .expect(200)
        .then((response) => {
          expect(response.body.comment).toEqual({
            body: "body_a",
            likes: 28,
            author: "username_a",
            comment_id: 1,
            find_id: 1,
            created_at: "2020-04-06T12:17:00.000Z",
          });
        });
    });
    describe("Error handling", () => {
      test("status:400, no inc_likes on request body", () => {
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
      test("status:404 invalid inc_likes provided (string)", () => {
        const commentUpdate = {
          inc_likes: "a string",
        };
        return request(app)
          .patch("/api/comments/3")
          .send(commentUpdate)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("error - invalid input");
          });
      });
      test("status:404 invalid inc_likes provided (boolean)", () => {
        const commentUpdate = {
          inc_likes: false,
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
                bio: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("GET /api/users/:username", () => {
    test("status: 200 - responds with user", () => {
      return request(app)
        .get("/api/users/username_a")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of finds/1
          expect(Object.keys(response.body)).toHaveLength(1);
          expect(Object.keys(response.body)[0]).toEqual("user");
          expect(response.body.user).toEqual(
            expect.objectContaining({
              username: "username_a",
              name: "name_a",
              avatar_url: "avatar_a",
              bio: "bio_a",
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
  // GET comments by username
  describe("GET /api/users/:username/comments", () => {
    test("status: 200 - responds with user comments array", () => {
      return request(app)
        .get("/api/users/username_a/comments")
        .expect(200)
        .then((response) => {
          // check that response object has a single key of finds/1
          expect(Object.keys(response.body)).toHaveLength(1);
          expect(Object.keys(response.body)[0]).toEqual("comments");
          expect(response.body.comments.comments.length).toEqual(4);
          expect(response.body.comments.commentCount).toEqual(4);
          expect(response.body.comments.comments[0]).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              likes: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
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
  // GET finds by username
  describe("GET /api/users/:username/finds", () => {
    test("status: 200 - responds with user finds array", () => {
      return request(app)
        .get("/api/users/username_a/finds")
        .expect(200)
        .then((response) => {
          console.log("response: ", response.body.finds.finds)
          // check that response object has a single key of finds/1
          expect(Object.keys(response.body)).toHaveLength(1);
          expect(Object.keys(response.body)[0]).toEqual("finds");
          expect(response.body.finds.finds.length).toEqual(3);
          expect(response.body.finds.findCount).toEqual(3);
          expect(response.body.finds.finds[0]).toEqual(
            expect.objectContaining({
              find_id: expect.any(Number),
              title: expect.any(String),
              type: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              location_id: expect.any(Number),
              settlement: expect.any(String),
              county: expect.any(String),
              img_url: expect.any(String),
              latitude: expect.any(Number),
              longitude: expect.any(Number),
              created_at: expect.any(String),
              likes: expect.any(Number),
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
