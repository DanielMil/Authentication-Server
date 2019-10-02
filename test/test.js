const axios = require("axios");
const assert = require("assert");

const HOST = "http://0.0.0.0:5000";

// Remove all records from database before beginning test
beforeEach(async () => {
  try {
    const res = await axios.delete(`${HOST}/dev/AllUsers`);
    assert.equal(200, res.status);
  } catch (err) {
    assert.fail("Failed to setup database for testing.");
  }
});

describe("Overall user flow happy path", () => {
  it("Successfully create user", async () => {
    try {
      const res = await axios.post(`${HOST}/auth/register`, {
        username: "JaneDoe123",
        email: "JaneDoe@hotmail.com",
        password: "password",
        firstName: "Jane",
        lastName: "Doe",
        phoneNumber: "4162197332"
      });
      assert.equal(200, res.status);
    } catch (err) {
      assert.fail("Failed to reach registration endpoint.");
    }
  });

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
