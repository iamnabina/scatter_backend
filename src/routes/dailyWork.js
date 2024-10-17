require("dotenv").config();

const express = require("express");

const router = express.Router();

const dailyWorkController = require("../controllers/dailyWork");

router.get("/", dailyWorkController.getDailyWork);

module.exports = router;
