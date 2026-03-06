const auth = require("../middleware/auth");
require("dotenv").config();
const express = require("express");
const Customer = require("../models/customer");

const Joi = require("joi");

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  phone: Joi.number().min(3).required(),
});

router.get("/", async (req, res) => {
  const customer = await Customer.find()
    .select("name isGold phone")
    .sort("name");
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

router.post("/", auth, async (req, res) => {
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

router.put("/:id", auth, async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id },
    { name: req.body.name },
    { phone: req.body.phone },
    { new: true },
  );

  if (!customer) return console.log("Customer with the given id is not found");
  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.send("Customer with the given id is not found ");
  res.send(customer);
});

module.exports = router;
