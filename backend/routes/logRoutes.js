const express = require("express");
const router = express.Router();
const { createLog, getLogs } = require("../controllers/logController");

router.post("/create", createLog);
router.get("/", getLogs);

module.exports = router;
