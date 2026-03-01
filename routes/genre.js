require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().min(3).required(),
});

const DBPORT = process.env.DBPORT;

mongoose
  .connect(DBPORT)
  .then(() => {
    console.log("Connected to MongoDB ");
  })
  .catch((err) => {
    console.log("Couldn't connect to mongoDB ", err);
  });

const genreSchema = new mongoose.Schema({
  name: String,
});

const Genre = mongoose.model("Genre", genreSchema);

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.send("Genre with the given id is not found");

  res.send(genre);
});

router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.send(genre);
  } catch (ex) {
    console.error("DB error", ex.message);
    res.status(500).send("Something failed while saving the genre");
  }
});
module.exports = router;

// router.put("/:id", (req, res) => {
//   const genre = genres.find((c) => c.id === parseInt(req.params.id));
//   if (!genre) return res.send("Genre with the given id is not found");

//   const { error } = schema.validate(req.body);
//   if (error) return res.status(404).send(error.details[0].message);

//   genre.name = req.body.name;
//   res.send(genre);
// });

// router.delete("/:id", (req, res) => {
//   const genre = genres.find((c) => c.id === parseInt(req.params.id));
//   if (!genre) return res.send("Genre with the given id is not found");

//   const { error } = schema.validate(req.body);
//   if (error) return res.status(404).send(error.details[0].message);

//   const index = genres.indexOf(genre);
//   genres.splice(index, 1);
//   res.send(genre);
// });
