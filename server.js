/** Imports */
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

/** Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: `${process.env.FRONTEND_URI}`,
  })
);
require("./routes")(app);

app.get("/", (req, res) => {
  res.send("hii");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
