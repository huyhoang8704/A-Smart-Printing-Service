const { getUser } = require("../controllers/user.controller");
const PrintingLog = require("../models/PrintingLog");
const { Op } = require("sequelize");
const User = require("../models/User");
class LogService {
    // async createLog(userId, printerId, fileId, startTime, finishTime, a4Quantity, a3Quantity, noOfCopies) {
    //     console.log("Creating log");
    //     return await PrintingLog.create({
    //         userId,
    //         printerId,
    //         fileId,
    //         startTime,
    //         finishTime,
    //         a4Quantity,
    //         a3Quantity,
    //         noOfCopies,
    //     });
    // }

    async getLogById(id) {
        return await PrintingLog.findByPk(id);
    }

    async getLogByUserId(userId, page, limit) {
        console.log("getLogByStudentUserName log for student:", userId);
        return await PrintingLog.findAll({
            where: {
                userId: userId,
            },
            limit: limit,
            offset: (page - 1) * limit,
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

    async getTotalLogsOfStudent(userId, startTime) {
        return await PrintingLog.count({ where: { userId: userId } });
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

    async updateLog(id, updates) {
        const log = await PrintingLog.findByPk(id);
        if (!log) {
            throw new Error("Log not found");
        }
        return await log.update(updates);
    }
}

module.exports = new LogService();
