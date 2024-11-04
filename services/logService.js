const PrintingLog  = require("../models/PrintingLog");

class LogService {
    async createLog(studentUserName, printerId, fileId, startTime, finishTime, a4Quantity, a3Quantity, noOfCopies) {
        console.log("Creating log");
        return await PrintingLog.create({
            studentUserName,
            printerId,
            fileId,
            startTime,
            finishTime,
            a4Quantity,
            a3Quantity,
            noOfCopies
        });
    }

    async getLogById(id) {
        return await PrintingLog.findByPk(id);
    }
 
    async getLogByStudentUserName(studentUserName) {
        console.log("getLogByStudentUserName log for student:", studentUserName);
        return await PrintingLog.findAll({
            where: {
                studentUserName: studentUserName,
            },
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
