require("dotenv").config();
const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  phone: Joi.number().min(3).required(),
});

const customerSchema = new mongoose.Schema({
  name: String,
  isGold: Boolean,
  phone: Number,
});

const Customer = mongoose.model("Customer", customerSchema);

router.get("/", async (req, res) => {
  const customer = await Customer.find().select("name isGold phone");
  console.log(customer);
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return console.log("Customer with the given id is not found");

    res.send(customer);
  } catch (ex) {
    console.log("Error", ex);
    res.status(500).send("Something went wrong");
  }
});

router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let customer = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: true,
    });
    customer = await customer.save();

    res.send(customer);
  } catch (ex) {
    console.log("Error", ex);
    res.status(500).send("Something went wrong while saving into DB");
  }
});
module.exports = router;
