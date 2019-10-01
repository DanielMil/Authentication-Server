const axios = require("axios");
const assert = require("assert");

const HOST = "http://0.0.0.0:5000";

describe("Attempt to create a new user.", () => {
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
    } catch (e) {
      console.log(e.response.data);
      assert.equal(500, e.response.status);
    }
  });
});
