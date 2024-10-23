// Author: THAI
const { Router } = require("express");
const systemConfigController = require("../controllers/systemConfController");
const router = Router();

router.get("/:id", systemConfigController.getSystemConfigHandler);
router.put("/:id", systemConfigController.updateSystemConfigHandler);
router.delete("/:id/file-type/:fileType", systemConfigController.deletePermittedFileTypeHandler);
router.post("/:id", systemConfigController.addPermittedFileTypeHandler);

module.exports = router;
