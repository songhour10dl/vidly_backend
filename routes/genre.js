require("dotenv").config();
const express = require("express");
const { Genre } = require("../models/genre");
const Joi = require("joi");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().min(5).required(),
});

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

router.post("/", auth, async (req, res) => {
  console.log("Full Request Body:", req.body); // Check if this is {} or undefined
  console.log("User from Token:", req.user);
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

router.put("/:id", auth, async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true },
  );

  if (!genre) return console.log("Genre witht he given id was not found");
  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findOneAndDelete({ _id: req.params.id });
  if (!genre)
    return res.status(404).send("Genre with the given ID was not found.");
  res.send(genre);
});

module.exports = router;
