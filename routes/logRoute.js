/*
    Base url: /logs
*/ 
const { Router } = require("express");
const logController = require("../controllers/logController");
const {authenticateBearerToken} = require("../middlewares/authenticate.middleware");
const { authenticateRoleMiddleware } = require("../middlewares/authenticateRole");
const router = Router();


router.get("/", authenticateBearerToken, logController.getLogsByIdHandler); // For user
router.get("/all", authenticateBearerToken, authenticateRoleMiddleware(["SPSO"]), logController.getAllLogs); // For SPSO
// router.get("/time/:userId", logController.getLogsByTimeStudent);
// router.get("/allStudent/time", logController.getLogsByTime);
router.patch("/:id", logController.updateLog); // For user

// Add more routes as needed

module.exports = router;
