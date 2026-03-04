require("dotenv").config();
const express = require("express");
const { Movie } = require("../models/movie");
const Joi = require("joi");
const { Genre } = require("../models/genre");

const router = express.Router();

const schema = Joi.object({
  title: Joi.string().min(3).required(),
  genreId: Joi.string().alphanum().length(24).required(),
  numberInStock: Joi.number().min(1).required(),
  dailyRentalRate: Joi.number().min(1).required(),
});

router.get("/", async (req, res) => {
  const movie = await Movie.find().select(
    `title 
    genre
    numberInStock 
    dailyRentalRate`,
  );
  console.log(movie);
  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.send("Movie with the given id is not found");

  res.send(movie);
});

router.post("/", async (req, res) => {
  console.log("Input GenreId:", req.body.genreId);
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.send("Genre with the given if is not found");
  try {
    let movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    movie = await movie.save();
    res.send(movie);
  } catch (ex) {
    console.log("there's an error while saving Movie", ex);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.send(error.details[0].message);

  const movie = await Movie.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
    },
  );
  console.log(`update movie `, movie);

  if (!movie)
    return res.status(400).send("Movie with the given id is not found");
  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findOneAndDelete({ _id: req.params.id });
  res.send(movie);
  console.log(movie);
});
module.exports = router;
