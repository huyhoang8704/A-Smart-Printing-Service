const logService = require("../services/logService");
const Log = require("../models/PrintingLog");
const { getCeilingNumber } = require("../utils/numberFormat");
class LogController {
    async getLogsByIdHandler(req, res) {
        const userId = req.user.id;

        if (userId) {
            try {
                console.log("Fetching logs for studentID:", userId);
                let { date, limit = 20, page = 1 } = req.query;
                limit = parseInt(limit);
                page = parseInt(page);
                const logs = await logService.getLogByUserId(userId, date, page, limit);
                const total = await logService.countTotalLogsOfStudent(userId, date);
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
                res.status(200).json({
                    status: "success",
                    page,
                    limit,
                    total,
                    maxPage: getCeilingNumber(total / limit),
                    date,
                    data: formattedLogs,
                });
            } catch (error) {
                console.error("Error fetching logs:", error);
                res.status(500).json({ status: "failed", error: error.message });
            }
        } else {
            res.status(404).json({ status: "failed", msg: "userId is required" });
        }
    }

    // async getLogsByTimeStudent(req, res) {
    //     const { userId } = req.params;
    //     let { startTime, endTime, limit = 20, page = 1 } = req.query;
    //     limit = parseInt(limit);
    //     page = parseInt(page);
    //     try {
    //         const logs = await logService.getLogsByTimeStudent(userId, startTime, endTime, page, limit);
    //         const total = await logService.getTotalLogsOfStudent(userId);

    //         const formattedLogs = logs.map((log) => ({
    //             ...log.toJSON(),
    //             startPrintDate: log.startTime.toISOString().split("T")[0],
    //             startPrintTime: log.startTime.toISOString().split("T")[1].split(".")[0],
    //             endPrintDate: log.finishTime.toISOString().split("T")[0],
    //             endPrintTime: log.finishTime.toISOString().split("T")[1].split(".")[0],
    //         }));
    //         res.status(200).json({ status: "success", page, limit, total, data: formattedLogs });
    //     } catch (error) {
    //         console.error("Error fetching logs:", error);
    //         res.status(500).json({ error: error.message });
    //     }
    // }

    // For SPSO
    async getAllLogs(req, res) {
        let { date, limit = 20, page = 1 } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        try {
            const logs = await logService.getAllLogs(date, limit, page);
            const total = await logService.countAllLogs(date);
            res.send({ status: "success", total, page, maxPage: getCeilingNumber(total / limit), limit, data: logs });
        } catch (error) {
            console.log(error);
            res.send({ status: "failed", error });
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
            res.status(200).json({
                status: "success",
                page,
                limit,
                maxPage: getCeilingNumber(total / limit),
                total,
                data: formattedLogs,
            });
        } catch (error) {
            console.error("Error fetching logs:", error);
            res.status(500).json({ status: "failed", error: error.message });
        }
    }

    async updateLog(req, res) {
        const { id } = req.params;
        const { finishTime } = req.body;

        try {
            const updatedLog = await logService.updateLog(id, finishTime);
            res.status(200).json({ status: "success", data: updatedLog });
        } catch (error) {
            console.error("Update error:", error);

            if (error.message === "Log not found") {
                return res.status(404).json({ error: error.message });
            }

            res.status(500).json({ status: "failed", error: error.message });
        }
    }
}

module.exports = new LogController();
