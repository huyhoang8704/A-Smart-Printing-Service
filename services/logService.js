const { getUser } = require("../controllers/user.controller");
const {PrintingLog} = require("../models/PrintingLog");
const { Op, and, fn, col, Sequelize, where } = require("sequelize");
const User = require("../models/User");
const { formatDateForDB } = require("../utils/dateFormat");
const { File } = require("../models/File");
const { Printer } = require("../models/Printer");
class LogService {

    async getLogById(id) {
        return await PrintingLog.findByPk(id);
    }

    async getPrintedFile(fileId) {
        try {
            const file = await File.findByPk(fileId);
            return file;
        } catch (error) {
            throw error;
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

    async countAllLogs(date) {
        let condition = {};
        if (date)
            condition = Sequelize.where(
                Sequelize.fn("DATE", Sequelize.col("startTime")),
                formatDateForDB(new Date(date))
            );
        return await PrintingLog.count({
            where: condition,
        });
    }

    async getAllLogs(date, limit, page) {
        let condition = {};
        if (date) {
            condition = Sequelize.where(
                Sequelize.fn("DATE", Sequelize.col("startTime")),
                formatDateForDB(new Date(date))
            );
        }
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
