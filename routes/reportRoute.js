const {Router} = require("express");
const { getReportHandler } = require("../controllers/reportController");

const router = Router();

router.get("/", getReportHandler);

module.exports = router