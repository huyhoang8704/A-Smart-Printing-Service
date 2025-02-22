// Author: THAI
const { Router } = require("express");
const systemConfigController = require("../controllers/systemConfController");
const router = Router();
const { authenticateBearerToken } = require("../middlewares/authenticate.middleware");
const { authenticateRoleMiddleware } = require("../middlewares/authenticateRole");

router.use(authenticateBearerToken);
router.get("/file-types/all", systemConfigController.getAllPossibleFileTypesHandler)
router.get("/permitted-file-types", systemConfigController.getPermittedFileTypeHandler);
router.get("/all", systemConfigController.getAllSystemConfigHandler);
router.post("/:id/file-type", authenticateRoleMiddleware(["SPSO"]), systemConfigController.addPermittedFileTypeHandler);
router.get("/:id", systemConfigController.getSystemConfigHandler);
router.put("/:id", authenticateRoleMiddleware(["SPSO"]), systemConfigController.updateSystemConfigHandler);
router.delete(
    "/:id/file-type/:fileType",
    authenticateRoleMiddleware(["SPSO"]),
    systemConfigController.deletePermittedFileTypeHandler
);



module.exports = router;
