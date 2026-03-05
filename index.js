require("dotenv").config();
const Joi = require("joi");
const express = require("express");
Joi.objectid = require("joi-objectid")(Joi);
const genre = require("./routes/genre");
const homepage = require("./routes/homepage");
const customer = require("./routes/customer");
const movie = require("./routes/movie");
const Rental = require("./routes/rental");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const DBPORT = process.env.DBPORT;

mongoose
  .connect(DBPORT)
  .then(() => {
    console.log("Connected to MongoDB ");
  })
  .catch((err) => {
    console.log("Couldn't connect to mongoDB ", err);
  });

app.use("/api/rental", Rental);
app.use("/api/movie", movie);
app.use("/api/customer", customer);
app.use("/api/genre", genre);
app.use("/", homepage);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is listening to ${port}`);
});
