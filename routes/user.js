const auth = require("../middleware/auth"); // auth= authorization
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const Joi = require("joi");
const _ = require("lodash");
const User = require("../models/user");

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(50).required(),
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-passsord");
  res.send(user);
  console.log(user);
});

router.post("/users", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already exist ");

  try {
    user = new User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (ex) {
    console.log("Something went wrong while saving User", ex);
  }
});

module.exports = router;
