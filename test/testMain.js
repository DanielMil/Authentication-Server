const axios = require("axios");
const assert = require("assert");

const HOST = "http://0.0.0.0:5000";

describe("Overall user flow happy path", () => {
  it("Attempt to clean database", async () => {
    try {
      const res = await axios.delete(`${HOST}/dev/AllUsers`);
      assert.equal(200, res.status);
    } catch (err) {
      assert.fail("Failed to setup database for testing.");
    }
  });

  it("Successfully create user", async () => {
    try {
      const res = await axios.post(`${HOST}/auth/register`, {
        email: "JaneDoe@hotmail.com",
        password: "password"
      });
      assert.equal(200, res.status);
    } catch (err) {
      assert.fail("Failed to reach registration endpoint.");
    }
  });

  it("Successfully login with new user.", async () => {
    try {
      const res = await axios.post(`${HOST}/auth/login`, {
        email: "JaneDoe@hotmail.com",
        password: "password"
      });
      assert.equal(200, res.status);
    } catch (err) {
      assert.fail("Failed to reach login endpoint.");
    }
  });
});
