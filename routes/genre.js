const express = require("express");

const router = express.Router();
const genres = [
  { id: 1, name: "Drama" },
  { id: 2, name: "Sci-Fi" },
  { id: 3, name: "Action" },
];

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.send("Genre with the given id is not found");

  res.send(genre);
});

router.post("/api/genre/", (req, res) => {
  console.log(` body is being read${req.body.name}`);
  const { error } = schema.validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(genre);
  res.send(genre);
});

router.put("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.send("Genre with the given id is not found");

  const { error } = schema.validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.send("Genre with the given id is not found");

  const { error } = schema.validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

module.exports = router;
