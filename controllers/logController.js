const logService = require("../services/logService");
const Log = require("../models/PrintingLog");
const { v4: uuidv4 } = require("uuid");
class LogController {
    // async createLog(req, res) {
        // const { userId, printerId, fileId, noOfCopies, a3Quantity, a4Quantity } = req.body;
        // try {
        //     const now = new Date();
        //     const startPrintTime = now.toISOString(); // Thời gian bắt đầu in

        //     const time = (a3Quantity * 2 + a4Quantity * 1) * noOfCopies;
        //     const endPrintTime = new Date(now.getTime() + time * 1000).toISOString(); // Thời gian kết thúc in

        //     const newLog = Log.build({
        //         id: uuidv4(),
        //         startTime: startPrintTime,
        //         finishTime: endPrintTime,
        //         a4Quantity,
        //         a3Quantity,
        //         noOfCopies,
        //         fileId,
        //         printerId,
        //         userId,
        //     });
        //     await newLog.save();
        //     res.status(201).json({ status: "success", data: newLog });
        // } catch (error) {
        //     res.status(500).json({ status: "failed", error: error.message });
        // }
    // }

    async getLog(req, res) {
        const userId = req.params.userId;

        if (userId) {
            try {
                console.log("Fetching logs for studentID:", userId);
                let { limit = 20, page = 1 } = req.query;
                limit = parseInt(limit);
                page = parseInt(page);
                const logs = await logService.getLogByUserId(userId, page, limit);
                const total = await logService.getTotalLogsOfStudent(userId);
                console.log("Logs found:", logs);

                const formattedLogs = logs.map((log) => {
                    return {
                        ...log.toJSON(),
                        startPrintDate: log.startTime.toISOString().split("T")[0],
                        startPrintTime: log.startTime.toISOString().split("T")[1].split(".")[0],
                        endPrintDate: log.finishTime ? log.finishTime.toISOString().split("T")[0] : null,
                        endPrintTime: log.finishTime ? log.finishTime.toISOString().split("T")[1].split(".")[0] : null,
                    };
                });
                res.status(200).json({ status: "success", page, limit, total, data: formattedLogs });
            } catch (error) {
                console.error("Error fetching logs:", error);
                res.status(500).json({ status: "failed", error: error.message });
            }
        } else {
            res.status(404).json({ status: "failed", msg: "userId is required" });
        }
    }

    async getLogsByTimeStudent(req, res) {
        const { userId } = req.params;
        let { startTime, endTime, limit = 20, page = 1 } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        try {
            const logs = await logService.getLogsByTimeStudent(userId, startTime, endTime, page, limit);
            const total = await logService.getTotalLogsOfStudent(userId);

            const formattedLogs = logs.map((log) => ({
                ...log.toJSON(),
                startPrintDate: log.startTime.toISOString().split("T")[0],
                startPrintTime: log.startTime.toISOString().split("T")[1].split(".")[0],
                endPrintDate: log.finishTime.toISOString().split("T")[0],
                endPrintTime: log.finishTime.toISOString().split("T")[1].split(".")[0],
            }));
            res.status(200).json({ status: "success", page, limit, total, data: formattedLogs });
        } catch (error) {
            console.error("Error fetching logs:", error);
            res.status(500).json({ error: error.message });
        }
    }
    async getLogsByTime(req, res) {
        const { startTime, endTime } = req.query;

        try {
            const logs = await logService.getLogsByTime(startTime, endTime);

            const formattedLogs = logs.map((log) => ({
                ...log.toJSON(),
                startPrintDate: log.startTime.toISOString().split("T")[0],
                startPrintTime: log.startTime.toISOString().split("T")[1].split(".")[0],
                endPrintDate: log.finishTime.toISOString().split("T")[0],
                endPrintTime: log.finishTime.toISOString().split("T")[1].split(".")[0],
            }));
            res.status(200).json({ status: "success", page, limit, total, data: formattedLogs });
        } catch (error) {
            console.error("Error fetching logs:", error);
            res.status(500).json({ status: "failed", error: error.message });
        }
    }

    async updateLog(req, res) {
        const { id } = req.params;
        const updates = req.body;

        try {
            const updatedLog = await logService.updateLog(id, updates);
            res.status(200).json(updatedLog);
        } catch (error) {
            console.error("Update error:", error);

            if (error.message === "Log not found") {
                return res.status(404).json({ error: error.message });
            }

            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new LogController();
