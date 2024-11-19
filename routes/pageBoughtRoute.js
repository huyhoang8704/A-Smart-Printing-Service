const { Router } = require("express");
const router = Router();
const pageBoughtHandler = require("../controllers/pageBoughtController");
const { authenticateBearerToken } = require("../middlewares/authenticate.middleware");


router.get("/result", pageBoughtHandler.result);
router.post("/result", pageBoughtHandler.result);
router.use(authenticateBearerToken);

router.post("/test-momo", pageBoughtHandler.buyPagesHandler);
router.post("/buy", pageBoughtHandler.requestBuyPagesHandler);
router.patch("/buy", pageBoughtHandler.updateOrderHandler);
router.get("/history", pageBoughtHandler.viewPageBoughtHistory);

module.exports = router;
