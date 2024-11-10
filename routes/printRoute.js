var express = require("express")
const {authenticateBearerToken} = require("../middlewares/authenticate.middleware")
const printController  = require("../controllers/printController")
const router = express.Router()

router.post("/", authenticateBearerToken, printController.printHandler)


module.exports = router