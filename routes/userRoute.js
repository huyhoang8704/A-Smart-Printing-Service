const { Router } = require("express");
const userController = require("../controllers/user.controller");
const router = Router();

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/:id", userController.getUser);
// router.put("/:id", userController.updateUser);

// Add more routes as needed

module.exports = router;
