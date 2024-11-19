const { Router } = require("express");
const router = Router();
const pageBoughtHandler = require("../controllers/pageBoughtController");
const { authenticateBearerToken } = require("../middlewares/authenticate.middleware");


router.post("/result/momo", pageBoughtHandler.paymentResultHandler);
// router.get("/result/momo", pageBoughtHandler.paymentResultHandler);
router.use(authenticateBearerToken);

router.post("/buy/momo", pageBoughtHandler.buyPagesHandler);
router.get("/price", pageBoughtHandler.getPagePrice);
// router.post("/buy", pageBoughtHandler.requestBuyPagesHandler);
// router.patch("/buy", pageBoughtHandler.updateOrderHandler);
router.get("/history", pageBoughtHandler.viewPageBoughtHistory);

module.exports = router;
