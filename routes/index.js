const authRouter = require("./authRouter");

module.exports = (app) => {
  app.use("/api/login", authRouter);
};
