var express = require("express")
const authenticateMiddleware = require("../middlewares/authenticate.middleware")
const printController  = require("../controllers/printController")
const router = express.Router()

router.post("/", authenticateMiddleware, printController.printHandler)


module.exports = router