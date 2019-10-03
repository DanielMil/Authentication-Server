const axios = require("axios");
const assert = require("assert");

const HOST = "http://0.0.0.0:5000";

describe("Overall user flow happy path", () => {
  it("Successfully login with new user.", async () => {
    try {
      const res = await axios.post(`${HOST}/auth/login`, {
        username: "JaneDoe@hotmail.com",
        password: "password"
      });
      assert.equal(200, res.status);
    } catch (err) {
      assert.fail("Failed to reach login endpoint.");
    }
  });
});
