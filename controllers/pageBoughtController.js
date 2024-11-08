const pageBoughtService = require("../services/pageBoughtService");
const { getCeilingNumber } = require("../utils/numberFormat");

async function buyPagesHandler(req, res) {
    const userId = req.user.id;
    if (userId) {
        try {
            let { pageNum } = req.body;
            pageNum = parseInt(pageNum);
            // create when user have already paid
            const result = await pageBoughtService.buyPage(userId, pageNum);
            res.send({ status: "success", data: result });
        } catch (error) {
            console.log(error);
            res.send({ status: "failed", error });
        }
    } else {
        res.send({ status: "failed", msg: "userId is required" });
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
