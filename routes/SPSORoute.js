const { Router } = require("express");
const SPSOController = require("../controllers/SPSOController");
const {authenticateBearerToken} = require("../middlewares/authenticate.middleware");
const router = Router();

router.post("/register", SPSOController.register);
router.post("/login", SPSOController.login);
router.post("/logout", authenticateBearerToken, SPSOController.logout);

// router.get("/:id", authenticateTokenMiddleware , userController.getUser);
// router.put("/:id", userController.updateUser);

// Add more routes as needed

module.exports = router;
