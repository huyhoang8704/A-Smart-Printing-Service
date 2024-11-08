const { Router } = require("express");
const logController = require("../controllers/logController");
const authenticateToken = require("../middlewares/authenticate.middleware");
const router = Router();

router.use(authenticateToken)

router.get("/", logController.getLogsByIdHandler); // For user
router.get("/all", logController.getAllLogs); // For SPSO
// router.get("/time/:userId", logController.getLogsByTimeStudent);
// router.get("/allStudent/time", logController.getLogsByTime);
router.patch("/:id", logController.updateLog); // For user

// Add more routes as needed

module.exports = router;
