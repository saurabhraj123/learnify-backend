const authRouter = require("./authRouter");
const courseRouter = require("./courseRouter");

module.exports = (app) => {
  app.use("/api/login", authRouter);
  app.use("/api/courses", courseRouter);
};
