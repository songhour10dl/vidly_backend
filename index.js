require("dotenv").config();
const Joi = require("joi");
const express = require("express");
const genre = require("./routes/genre");
const homepage = require("./routes/homepage");

const app = express();
app.use(express.json());

app.use("/api/genre", genre);
app.use("/", homepage);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is listening to ${port}`);
});
