require("dotenv").config();
const express = require("express");
const error = require("./middleware/error");
const Joi = require("joi");
Joi.objectid = require("joi-objectid")(Joi);
const genre = require("./routes/genre");
const homepage = require("./routes/homepage");
const customer = require("./routes/customer");
const movie = require("./routes/movie");
const Rental = require("./routes/rental");
const User = require("./routes/user");
const Auth = require("./routes/auth");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

if (!process.env.jwtPrivateKey) {
  console.error("Fatal error: jwtPrivateKey is not defined in .env");
  process.exit(1);
}

const DBPORT = process.env.DBPORT;

mongoose
  .connect(process.env.DBPORT)
  .then(() => {
    console.log("Connected to MongoDB ");
  })
  .catch((err) => {
    console.log("Couldn't connect to mongoDB ", err);
  });

app.use("/", homepage);
app.use("/api/genre", genre);
app.use("/api/movie", movie);
app.use("/api/customer", customer);
app.use("/api/rental", Rental);
app.use("/api", User);
app.use("/api/auth", Auth);
app.use(error);


const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is listening to ${port}`);
});
