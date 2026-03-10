const express = require("express");
const genre = require("../routes/genre");
const homepage = require("../routes/homepage");
const customer = require("../routes/customer");
const movie = require("../routes/movie");
const Rental = require("../routes/rental");
const User = require("../routes/user");
const Auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/", homepage);
  app.use("/api/genre", genre);
  app.use("/api/movie", movie);
  app.use("/api/customer", customer);
  app.use("/api/rental", Rental);
  app.use("/api", User);
  app.use("/api/auth", Auth);
  app.use(error);
};
