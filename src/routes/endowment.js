require("dotenv").config();

const express = require("express");

const router = express.Router();

const endowmentController = require("../controllers/endowment");

router.get("/", endowmentController.getEndowment);

module.exports = router;
