const { Router } = require("express");
const logController = require("../controllers/logController");
const authenticateToken = require("../middlewares/authenticate.middleware");
const router = Router();

router.use(authenticateToken)

// router.post("/", logController.createLog);
router.get("/:userId", logController.getLog);
router.get("/time/:userId", logController.getLogsByTimeStudent);
router.get("/allStudent/time", logController.getLogsByTime);
router.put("/:userId", logController.updateLog);

// Add more routes as needed

module.exports = router;
