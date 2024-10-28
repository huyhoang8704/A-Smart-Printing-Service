const { Sequelize, fn, col } = require("sequelize");
const { PrintingLog } = require("../models/PrintingLog");
const { formatDateForDB } = require("../utils/dateFormat");
const { PaperBoughtHistory } = require("../models/PaperBoughtHistory");

async function _getPrintingTurn(date, option) {
    try {
        var newDate = date;
        if (option.toUpperCase() === "MONTH") {
            newDate = new Date(date);
            newDate = newDate.getMonth() + 1;
        } else if (option.toUpperCase() === "YEAR") {
            newDate = new Date(date);
            newDate = newDate.getFullYear();
        }
        console.log(newDate);

        const response = await PrintingLog.findOne({
            attributes: [
                [fn('COUNT', col("*")), 'printingTurn'],
                [fn('SUM', col("a4Quantity")), 'a4Quantity'],
                [fn('SUM', col("a3Quantity")), 'a3Quantity'],
            ],
            where: Sequelize.where(fn(option, col("startTime")), newDate),
        });
        return response;
    } catch (error) {
        console.log(error);
        return -1;
    }
}

async function _getPaperBoughtStat(date, option) {
    try {
        var newDate = date;
        if (option.toUpperCase() === "MONTH") {
            newDate = new Date(date);
            newDate = newDate.getMonth() + 1;
        } else if (option.toUpperCase() === "YEAR") {
            newDate = new Date(date);
            newDate = newDate.getFullYear();
        }
        const response = await PaperBoughtHistory.findOne({
            attributes: [
                
                [fn("SUM", col("noOfPage")), "totalPages"],
                [fn("SUM", col("totalBill")), "totalRevenue"],
            ],
            where: Sequelize.where(fn(option, col("createdAt")), newDate),
        });
        return response;
    } catch (error) {
        console.log(error);
        return {};
    }
}

async function getRevenueOfYearOverMonth({ year }) {
    if (year) {
        try {
            const response = await PaperBoughtHistory.findAll({
                attributes: [
                    [fn("SUM", col("totalBill")), "totalRevenue"],
                    [fn("MONTH", col("createdAt")), "month"],
                   
                ],
                group: [fn("MONTH", col("createdAt"))],
                where: Sequelize.where(fn("YEAR", col("createdAt")), year),
            });
            return { status: "success", year: year, data: response };
        } catch (error) {
            console.log(error);
            return { status: "failed", error };
        }
    }
    else 
    {
        return { status: "failed", msg: "year is required" };
    }
}

async function getReport({ date, option }) {
    let opt = option || "DATE";
    if (date) {
        console.log(date);
        
        const formattedDate = formatDateForDB(date);
        console.log(formattedDate);
        const printingStat = await _getPrintingTurn(formattedDate, opt);
        const paperBoughtStat = await _getPaperBoughtStat(formattedDate, opt);
        // const revenueByYear = await _getRevenueOfYearByMonth(new Date(date).getFullYear());
        return {
            status: "success",
            data: {
                printingStat,
                paperBoughtStat,
                statDate: new Date(date),
                option: opt,
                // revenueByYear
            },
        };
    } else {
        return { status: "failed", msg: "date is required" };
    }
}

exports.getReport = getReport;
exports.getRevenueOfYearOverMonth = getRevenueOfYearOverMonth;
