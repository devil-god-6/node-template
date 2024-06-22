const express = require("express");
const { getHome } = require("../controllers");
const router = express.Router();

router.get('/', getHome);

module.exports = router;
