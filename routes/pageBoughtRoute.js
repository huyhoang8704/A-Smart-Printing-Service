const {Router} = require("express")
const router = Router()
const pageBoughtHandler = require("../controllers/pageBoughtController")
const {authenticateToken} = require("../middlewares/authenticate.middleware")

router.use(authenticateToken)

router.post("/buy", pageBoughtHandler.buyPagesHandler)
router.get("/history", pageBoughtHandler.viewPageBoughtHistory)

module.exports = router