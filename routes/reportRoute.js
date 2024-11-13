const { Router } = require("express");
const { getReportHandler, getYearlyStatHandler } = require("../controllers/reportController");
const { authenticateBearerToken } = require("../middlewares/authenticate.middleware");
const { authenticateRoleMiddleware } = require("../middlewares/authenticateRole");
const router = Router();
router.use(authenticateBearerToken);

router.get("/", authenticateRoleMiddleware(["SPSO"]), getReportHandler);
router.get("/stat/:year", authenticateRoleMiddleware(["SPSO"]), getYearlyStatHandler);

module.exports = router;
