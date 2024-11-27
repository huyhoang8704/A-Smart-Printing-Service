const logService = require("../services/logService");
const { PrintingLog } = require("../models/PrintingLog");
const { getCeilingNumber } = require("../utils/numberFormat");
const { formatDateForDB, formatLocalTime } = require("../utils/dateFormat");
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
                // const printedFile = await logService.getPrintedFile(logs.)
                console.log("Logs found:", logs);

                const formattedLogs = logs.map((log) => {
                    return {
                        ...log.toJSON(), // toJSON is used to delete all the redundant fields returned by sequelize
                        startPrintDate: formatDateForDB(log.startTime),
                        startPrintTime: formatLocalTime(log.startTime),
                        endPrintDate: formatDateForDB(log.finishTime),
                        endPrintTime: formatLocalTime(log.finishTime),
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
        let { date, limit = 20, page = 1, uniId, building } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        try {
            const logs = await logService.getAllLogs(date, limit, page, uniId, building);
            const total = await logService.countAllLogs(date, uniId, building);
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

            // const formattedLogs = logs.map((log) => ({
            //     ...log.toJSON(),
            //     startPrintDate: log.startTime.toISOString().split("T")[0],
            //     startPrintTime: log.startTime.toISOString().split("T")[1].split(".")[0],
            //     endPrintDate: log.finishTime.toISOString().split("T")[0],
            //     endPrintTime: log.finishTime.toISOString().split("T")[1].split(".")[0],
            // }));
            res.status(200).json({
                status: "success",
                page,
                limit,
                maxPage: getCeilingNumber(total / limit),
                total,
                data: logs,
            });
        } catch (error) {
            console.error("Error fetching logs:", error);
            res.status(500).json({ status: "failed", error: error.message });
        }
    }

    async updateLog(req, res) {
        const { id } = req.params;
        const { action } = req.body;
        if (action === "finish") {
            try {
                let finishTime = new Date(Date.now());
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
}

module.exports = new LogController();
