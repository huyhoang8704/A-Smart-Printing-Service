const {Router} = require("express")
const router = Router()
const pageBoughtHandler = require("../controllers/pageBoughtController")
const {authenticateBearerToken} = require("../middlewares/authenticate.middleware")

router.use(authenticateBearerToken)

router.post("/buy", pageBoughtHandler.buyPagesHandler)
router.get("/history", pageBoughtHandler.viewPageBoughtHistory)

module.exports = router