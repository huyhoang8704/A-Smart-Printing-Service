const { default: axios } = require("axios");
const pageBoughtService = require("../services/pageBoughtService");
const { getCeilingNumber } = require("../utils/numberFormat");
const crypto = require("crypto");

async function buyPagesHandler(req, res) {
    var accessKey = "F8BBA842ECF85";
    var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var orderInfo = "pay with MoMo";
    var partnerCode = "MOMO";
    var redirectUrl = "http://localhost:3001";
    var ipnUrl = "http://localhost:3001";
    var requestType = "payWithMethod";
    var amount = "50000";
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = "";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";
    var rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        amount +
        "&extraData=" +
        extraData +
        "&ipnUrl=" +
        ipnUrl +
        "&orderId=" +
        orderId +
        "&orderInfo=" +
        orderInfo +
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        redirectUrl +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);
    //signature
    var signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    const requestBody = {
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature,
    };
    try {
        const response = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody);
        const data = response.data;
        console.log(data);
        res.send(data);
    } catch (error) {
        console.log(error);
        res.send({ status: error, error });
    }
}

async function requestBuyPagesHandler(req, res) {
    const userId = req.user.id;
    if (userId) {
        try {
            let { pageNum } = req.body;
            pageNum = parseInt(pageNum);
            // create when user have already paid
            const result = await pageBoughtService.requestBuyPage(userId, pageNum);
            res.send({ status: "success", data: result });
        } catch (error) {
            console.log(error);
            res.send({ status: "failed", error: error.message });
        }
    } else {
        res.send({ status: "failed", msg: "userId is required" });
    }
}

async function updateOrderHandler(req, res) {
    const userId = req.user.id;
    if (userId) {
        try {
            const { msg, data } = await pageBoughtService.updatePageBoughtOrder(userId, req.body);
            res.send({ status: "success", data, msg });
        } catch (error) {
            console.log(error);
            if (error.name === "FORBIDDEN") res.status(403).send({ status: "failed", error: error.message });
            else {
                res.status(404).send({ status: "failed", error: error.message });
            }
        }
    } else {
        res.status(401).send({ status: "failed", msg: "userId is required" });
    }
}

async function viewPageBoughtHistory(req, res) {
    const userId = req.user.id;
    if (userId) {
        try {
            let { limit = 20, page = 1, date } = req.query;
            limit = parseInt(limit);
            page = parseInt(page);
            const { data, total } = await pageBoughtService.viewPageBoughtHistory(userId, date, limit, page);
            res.send({ status: "success", date, total, data, page, limit, maxPage: getCeilingNumber(total / limit) });
        } catch (error) {
            console.log(error);
            res.send({ status: "failed", error });
        }
    } else {
        res.send({ status: "failed", msg: "userId is required" });
    }
}

exports.buyPagesHandler = buyPagesHandler;
exports.viewPageBoughtHistory = viewPageBoughtHistory;
exports.requestBuyPagesHandler = requestBuyPagesHandler;
exports.updateOrderHandler = updateOrderHandler;
