// Author: THAI
const { Router } = require("express");
const router = Router();
const printerController = require("../controllers/printerController");
const { authenticateBearerToken } = require("../middlewares/authenticate.middleware");
const { authenticateRoleMiddleware } = require("../middlewares/authenticateRole");

router.use(authenticateBearerToken);

router.get("/:printerID", authenticateRoleMiddleware(["SPSO"]), printerController.getPrinterHandler);
router.patch("/:printerID", authenticateRoleMiddleware(["SPSO"]), printerController.updatePrinterHandler);
router.get("/", authenticateRoleMiddleware(["SPSO"]),printerController.getAllPrintersHandler); // get all printers
router.post("/",  authenticateRoleMiddleware(["SPSO"]), printerController.addPrinterHandler);

module.exports = router;
