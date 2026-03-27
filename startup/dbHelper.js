// const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  // 1. Determine which connection string to use
  const db =
    process.env.NODE_ENV === "test" ? process.env.DBTEST : process.env.DBPORT;

  // 2. Connect only ONCE to the chosen one
  return mongoose
    .connect(db)
    .then(() => {
      if (process.env.NODE_ENV !== "test") {
        // console.log(`Connected to ${db}...`);
      } else {
        // console.log(`Connected to ${db}...`);
      }
    })
    .catch((err) => console.error("Could not connect to MongoDB...", err));
};
