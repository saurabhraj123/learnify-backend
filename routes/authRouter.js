const router = require("express").Router();
const { checkJwt } = require("../utils/authUtils");

router.post("/", checkJwt, (req, res) => {
  const { name, email } = req.body;
  console.log("yes", req);

  const response = `Hello ${name} ${email}`;
  res.send(response);
});

module.exports = router;
