const { getUser } = require("../controllers/user.controller");
const { PrintingLog } = require("../models/PrintingLog");
const { Op, and, fn, col, Sequelize, where } = require("sequelize");
const User = require("../models/User");
const { formatDateForDB } = require("../utils/dateFormat");
const { File } = require("../models/File");
const { Printer } = require("../models/Printer");
const userService = require("./userService");
const { getPrinterByBuilding } = require("./printerService");
class LogService {
    async getLogById(id) {
        return await PrintingLog.findByPk(id);
    }

    async getPrintedFile(fileId) {
        const file = await File.findByPk(fileId);
        return file;
    }

    async _addConditionPrinterByBuilding(condition, building) {
        if (building) {
            const printers = await getPrinterByBuilding(building); // get all printers in chosen building
            const printerIds = printers.map((printer) => printer.id);
            condition.printerId = { [Op.in]: printerIds };
        }
    }

    async getLogByUserId(userId, date, page, limit) {
        console.log("getLogByStudentUserName log for student:", userId);

        let condition = {
            userId: userId,
        };
        if (date) {
            condition = {
                [Op.and]: [
                    { userId: userId },
                    Sequelize.where(Sequelize.fn("DATE", Sequelize.col("startTime")), formatDateForDB(new Date(date))),
                ],
            };
        }

        return await PrintingLog.findAll({
            where: condition,
            limit: limit,
            offset: (page - 1) * limit,
            attributes: {
                exclude: ["printerId", "fileId"],
            },
            include: [
                {
                    model: File,
                    attributes: ["id", "fileName"],
                },
                {
                    model: Printer,
                    attributes: ["id", "model", "building", "room", "manufacturer"],
                },
            ],
        });
    }

    async getLogsByTimeStudent(userId, startTime, endTime, page, limit) {
        const conditions = {
            userId,
            [Op.and]: [
                { startTime: { [Op.gte]: new Date(startTime) } },
                { startTime: { [Op.lte]: new Date(endTime) } },
            ],
        };

        return await PrintingLog.findAll({
            where: conditions,
            limit: limit,
            offset: (page - 1) * limit,
        });
    }

    async countTotalLogsOfStudent(userId, date) {
        if (date) {
            return await PrintingLog.count({
                where: {
                    [Op.and]: [
                        { userId: userId },
                        Sequelize.where(
                            Sequelize.fn("DATE", Sequelize.col("startTime")),
                            formatDateForDB(new Date(date))
                        ),
                    ],
                },
            });
        }
        return await PrintingLog.count({ where: { userId: userId } });
    }

    async countAllLogs(date, uniId, building) {
        var condition = {};
        if (date)
            condition = Sequelize.where(
                Sequelize.fn("DATE", Sequelize.col("startTime")),
                formatDateForDB(new Date(date))
            );
        if (uniId) {
            const users = await userService.getUsersByUniIdRegex(uniId); // get user by uniID
            const usersIds = users.map((user) => user.id);
            condition.userId = {
                [Op.in]: usersIds,
            };
        }
        await this._addConditionPrinterByBuilding(condition, building);
        
        return await PrintingLog.count({
            where: condition,
        });
    }

    async getAllLogs(date, limit, page, uniId, building) {
        console.log(uniId, building);
        
        var condition = {};
        if (date) {
            condition.startTime = Sequelize.where(
                Sequelize.fn("DATE", Sequelize.col("startTime")),
                formatDateForDB(new Date(date))
            );
        }
        if (uniId) {
            const users = await userService.getUsersByUniIdRegex(uniId); // get user by uniID
            const usersIds = users.map((user) => user.id);
            condition.userId = {
                [Op.in]: usersIds,
            };
        }
        // filter by building

        await this._addConditionPrinterByBuilding(condition, building);
        console.log("condition", condition);

        return await PrintingLog.findAll({
            where: condition,
            limit: limit,
            offset: (page - 1) * limit,
            include: [
                {
                    model: File,
                    attributes: ["id", "fileName"],
                },
                {
                    model: User,
                    attributes: ["role", "id", "uniId", "fullName"],
                },
                {
                    model: Printer,
                    attributes: ["id", "model", "building", "room", "manufacturer"],
                },
            ],
        });
    }

    async getLogsByTime(startTime, endTime) {
        console.log("getLogsByTime log for time:", startTime, endTime);
        const conditions = {
            [Op.and]: [
                { startTime: { [Op.gte]: new Date(startTime) } },
                { startTime: { [Op.lte]: new Date(endTime) } },
            ],
        };
        return await PrintingLog.findAll({
            where: conditions,
        });
    }

    async updateLog(id, finishTime) {
        const log = await PrintingLog.findByPk(id);
        if (!log) {
            throw new Error("Log not found");
        }
        return await log.update({
            finishTime,
        });
    }
}

module.exports = new LogService();
