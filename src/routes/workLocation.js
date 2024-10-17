require("dotenv").config();

const express = require("express");

const router = express.Router();
const workLocationController = require("../controllers/workLocation");

router.get("/", workLocationController.getWorkLocation);

module.exports = router;
