module.exports = function () {
  if (!process.env.jwtPrivateKey) {
    throw new Error("Fatal error: jwtPrivateKey is not defined in .env");
  }
};
