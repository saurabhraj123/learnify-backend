const router = require("express").Router();
const { saveNewUser } = require("../db/mutations");
const { checkJwt } = require("../utils/authUtils");

router.post("/", checkJwt, async (req, res) => {
  const { first_name, last_name, email, image_url } = req.body;

  try {
    const user = await saveNewUser({ first_name, last_name, email, image_url });
    res.json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
