const express = require("express");
const loginRoutes = require("./login");
const router = express.Router();

router.use("/login", loginRoutes);
module.exports = router;
