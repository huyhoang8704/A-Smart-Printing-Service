const { Router } = require("express");
const userController = require("../controllers/user.controller");
const router = Router();

router.post("/", userController.register);
// router.get("/:id", userController.getUser);
// router.put("/:id", userController.updateUser);

// Add more routes as needed

module.exports = router;
