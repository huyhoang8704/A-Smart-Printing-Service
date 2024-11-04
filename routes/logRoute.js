const { Router } = require("express");
const logController = require("../controllers/logController");
const router = Router();

router.post("/", logController.createLog);
router.get("/:studentUserName", logController.getLog);
router.put("/:studentUserName", logController.updateLog);

// Add more routes as needed

module.exports = router;
