const router = require("express").Router();
const { checkJwt } = require("../utils/authUtils");

router.post("/login", checkJwt, (req, res) => {});

module.exports = router;
