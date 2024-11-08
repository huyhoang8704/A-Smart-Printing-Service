const {Router} = require("express")
const router = Router()
const pageBoughtHandler = require("../controllers/pageBoughtController")
const authenticateTokenMiddleware = require("../middlewares/authenticate.middleware")

router.use(authenticateTokenMiddleware)

router.post("/buy", pageBoughtHandler.buyPagesHandler)
router.get("/history", pageBoughtHandler.viewPageBoughtHistory)

module.exports = router