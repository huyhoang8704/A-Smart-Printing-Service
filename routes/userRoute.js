const { Router } = require("express");
const userController = require("../controllers/userController");
const router = Router();

router.post("/", userController.createUser);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);

// Add more routes as needed

module.exports = router;
