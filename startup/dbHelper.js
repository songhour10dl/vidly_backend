const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect(process.env.DBPORT)
    .then(() => {
      winston.info("Connected to MongoDB ");
      console.log("Connected to MongoDB");
    })
    .catch((ex) => {
      console.log(`couldn't connect to MongoDB`, ex);
    });
};
