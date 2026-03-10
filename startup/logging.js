const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
  );
  process.on("unhandledRejection", (ex) => {
    throw ex; // This throws it so the winston.exceptions.handle catches it;
  });

  winston.add(
    new winston.transports.MongoDB({
      db: process.env.DBPORT,
    }),
  );
};
