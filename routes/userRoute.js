const { Router } = require("express");
const userController = require("../controllers/user.controller");
const authenticateTokenMiddleware = require("../middlewares/authenticate.middleware")
const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

router.get("/:id",authenticateTokenMiddleware ,userController.getUser);
// router.put("/:id", userController.updateUser);

// Add more routes as needed

module.exports = router;
