const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  process.env.jwtPrivateKey = "testSecretKey";
  it("should populate req.user with the payload of a valid JWT ", () => {
    let id = new mongoose.Types.ObjectId().toHexString();
    const user = {
      _id: id,
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };

    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
