// Author: THAI
const { Router } = require("express");
const router = Router();
const printerController = require("../controllers/printerController");
const { authenticateBearerToken } = require("../middlewares/authenticate.middleware");
const { authenticateRoleMiddleware } = require("../middlewares/authenticateRole");

router.use(authenticateBearerToken);

router.get("/:printerID", printerController.getPrinterHandler);
router.patch("/:printerID", authenticateRoleMiddleware(["SPSO"]), printerController.updatePrinterHandler);
router.get("/" ,printerController.getAllPrintersHandler); // get all printers
router.post("/",  authenticateRoleMiddleware(["SPSO"]), printerController.addPrinterHandler);

module.exports = router;
