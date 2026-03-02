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

router.get("/", async (req, res) => {
  const genres = await Genre.find().select({ name: 1 });
  console.log(genres);
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.send("Genre with the given id is not found");

    res.send(genre);
  } catch (ex) {
    console.log("Full Error Object:", ex); // This will show if it's a 'CastError'
    if (ex.name === "CastError") {
      return res.status(400).send("That is not a valid MongoDB ObjectId.");
    }
    res.status(500).send("Something else went wrong.");
  }
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

router.put("/:id", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const genre = await Genre.findOneAndUpdate(
    { _id: req.params.id },
    { name: req.body.name },
    { new: true },
  );

  if (!genre) return console.log("Genre witht he given id was not found");
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findOneAndDelete({ _id: req.params.id });
  if (!genre) return console.log("Genre witht he given id was not found");
  res.send(genre);
});

module.exports = router;
