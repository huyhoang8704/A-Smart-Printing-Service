const { Op, Sequelize } = require("sequelize");
const sequelize = require("../config/mysql.database");
const { PaperBoughtHistory } = require("../models/PaperBoughtHistory");
const User = require("../models/User");
const { generateUUIDV4 } = require("../utils/idManager");
const { formatDateForDB } = require("../utils/dateFormat");

const PAGE_PRICE = 1000;

async function updatePageBoughtOrder(userId, data) {
    let { status, orderId } = data;
    if (orderId) {
        // check if orderId exists in request body
        try {
            const history = await PaperBoughtHistory.findByPk(orderId);
            if (history) {
                // check if order exists
                if (history.status === "cancelled" || history.status === "paid") {
                    let forbiddenError = new Error("This order is immutable");
                    forbiddenError.name = "FORBIDDEN";
                    throw forbiddenError; // 403
                } else {
                    let msg = "Cancel order successfully";
                    await history.update({
                        status: status,
                    });
                    // update history status
                    const updatedHistory = await history.update({
                        status: status,
                    });
                    if (status === "paid") {
                        // if status is paid then update noOfPage for user
                        await User.increment("numberPage", {
                            by: history.noOfPage,
                            where: {
                                id: userId,
                            },
                        });
                        msg = "Order paid successfully";
                    }

                    return { data: { order: updatedHistory }, msg };
                }
            } else {
                throw new Error("Order does not exists"); // 404
            }
        } catch (error) {
            throw error;
        }
    } else {
        throw new Error("OrderId is required"); // 400
    }
}

async function requestBuyPage(userId, pageNum) {
    try {
        // const user = await getUserById(userId);
        const history = await PaperBoughtHistory.create({
            userId: userId,
            id: generateUUIDV4(),
            noOfPage: pageNum,
            totalBill: PAGE_PRICE * pageNum,
            status: "unpaid",
        });
        return {
            boughtHistory: history,
            // userInfo: { fullName: user.fullName, numberPage: user.numberPage, email: user.email },
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function _countTotalHistoryItem(userId, date) {
    let condition = {
        userId: userId,
    };
    if (date) {
        condition = {
            [Op.and]: [
                { userId: userId },
                Sequelize.where(Sequelize.fn("DATE", sequelize.col("createdAt")), formatDateForDB(new Date(date))),
            ],
        };
    }
    return await PaperBoughtHistory.count({
        where: condition,
    });
}

async function viewPageBoughtHistory(userId, date, limit, page) {
    let condition = {
        userId: userId,
    };
    if (date) {
        condition = {
            [Op.and]: [
                { userId: userId },
                Sequelize.where(Sequelize.fn("DATE", sequelize.col("createdAt")), formatDateForDB(new Date(date))),
            ],
        };
    }
    try {
        const total = await _countTotalHistoryItem(userId, date);
        const history = await PaperBoughtHistory.findAll({
            where: condition,
            limit: limit,
            offset: (page - 1) * limit,
            order: [["createdAt", "DESC"]],
        });
        return { data: history, total };
    } catch (error) {
        throw error;
    }
}

exports.requestBuyPage = requestBuyPage;
exports.viewPageBoughtHistory = viewPageBoughtHistory;
exports.updatePageBoughtOrder = updatePageBoughtOrder;
