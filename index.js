require("dotenv").config();
const express = require("express");
const winston = require("winston");

const app = express();

require("./startup/validation")();
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/dbHelper")();
require("./startup/config")();

const port = process.env.PORT;

app.listen(port, () => {
  winston.info(`Server is listening to ${port}`);
  console.log(`Server is listening to ${port}`);
});
