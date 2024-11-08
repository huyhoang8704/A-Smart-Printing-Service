const { Op, Sequelize } = require("sequelize");
const sequelize = require("../config/mysql.database");
const { PaperBoughtHistory } = require("../models/PaperBoughtHistory");
const User = require("../models/User");
const { generateUUIDV4 } = require("../utils/idManager");
const { getUserById } = require("./userService");
const { formatDateForDB } = require("../utils/dateFormat");

const PAGE_PRICE = 1000;
async function buyPage(userId, pageNum) {
    const transaction = await sequelize.transaction();
    try {
        // increase user page
        await User.increment("numberPage", {
            by: pageNum,
            where: {
                id: userId,
            },
            transaction: transaction,
        });

        const user = await getUserById(userId);

        const history = await PaperBoughtHistory.create(
            {
                userId: userId,
                id: generateUUIDV4(),
                noOfPage: pageNum,
                totalBill: PAGE_PRICE * pageNum,
            },
            {
                transaction: transaction,
            }
        );
        await transaction.commit();
        return {
            boughtHistory: history,
            userInfo: { fullName: user.fullName, numberPage: user.numberPage, email: user.email },
        };
    } catch (error) {
        console.log(error);
        await transaction.rollback();
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

exports.buyPage = buyPage;
exports.viewPageBoughtHistory = viewPageBoughtHistory;
