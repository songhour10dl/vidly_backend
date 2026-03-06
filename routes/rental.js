const auth = require("../middleware/auth"); // auth= authorization
const express = require("express");
const Joi = require("joi");
const Customer = require("../models/customer");
const Movie = require("../models/movie");
const Rental = require("../models/rental");
const mongoose = require("mongoose");
const router = express.Router();

const schema = Joi.object({
  customerId: Joi.objectid().required(),
  movieId: Joi.objectid().required(),
  //   dateout: Joi.date().required(),
  //   dateReturned: Joi.date().required(),
  //   rentalFee: Joi.number().min(0).required(),
});

router.get("/", async (req, res) => {
  const rental = await Rental.find().sort("-dateOut");
  console.log(rental);
  res.send(rental);
});

router.post("/", auth, async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.send("Customer with the given id is not found");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.send("Movie with the given id is not found");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not instock");

  //   const session = await mongoose.startSession();
  //   session.startTransaction();
  //can't use this since am on mongoose locally
  try {
    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });
    await rental.save();

    await Movie.updateOne({ _id: movie.id }, { $inc: { numberInStock: -1 } });

    // await session.commitTransaction();

    res.send(rental);
  } catch (ex) {
    // await session.abortTransaction();
    res.status(500).send("Transaction failed.");
  } finally {
    // session.endSession();
  }
});

module.exports = router;
