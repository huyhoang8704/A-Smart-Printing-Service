const { Sequelize, fn, col } = require("sequelize");
const { PrintingLog } = require("../models/PrintingLog");
const { formatDateForDB } = require("../utils/dateFormat");
const { PaperBoughtHistory } = require("../models/PaperBoughtHistory");

async function _getPrintingTurn(date) {
    try {
        const response = await PrintingLog.count({
            where: Sequelize.where(fn("DATE", col("startTime")), date),
        });
        console.log(`${response} lượt in ngày ${date}`);
        return response;
    } catch (error) {
        console.log(error);
        return -1;
    }
}

async function _getPaperBoughtStat(date) {
    try {
        const response = await PaperBoughtHistory.findAll({
            attributes: [
                [fn("SUM", col("noOfPage")), "totalPages"],
                [fn("SUM", col("totalBill")), "totalRevenue"],
            ],
            where: Sequelize.where(fn("DATE", col("createdAt")), date),
        });
        // console.log(response);

        return response;
    } catch (error) {
        console.log(error);
        return {};
    }
}

async function _getRevenueOfYearByMonth(year) {
    try {
        const response = await PaperBoughtHistory.findAll({
            attributes: [
                [fn("SUM", col("totalBill")), "totalRevenue"],
                [fn("MONTH", col("createdAt")), "month"]
            ],
            group: [fn("MONTH", col("createdAt"))],
            where: Sequelize.where(fn("YEAR", col("createdAt")), year)
        });
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function getReport({ date }) {
    if (date) {
        const formattedDate = formatDateForDB(date);
        const printingTurn = await _getPrintingTurn(formattedDate);
        const paperBoughtStat = await _getPaperBoughtStat(formattedDate);
        const revenueByYear = await _getRevenueOfYearByMonth(new Date(date).getFullYear());
        return {
            status: "success",
            data: {
                printingTurn,
                paperBoughtStat,
                statDate: new Date(date),
                revenueByYear
            },
        };
    } else {
        return { status: "failed", msg: "date is required" };
    }
}

exports.getReport = getReport;
