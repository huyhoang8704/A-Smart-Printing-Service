const logService = require("../services/logService");
const Log = require("../models/PrintingLog");
const { v4: uuidv4 } = require('uuid');
class LogController {
    async createLog(req, res) {
        const { userId, printerId, fileId, noOfCopies, a3Quantity, a4Quantity} = req.body;
        try {
            // Lấy thời gian hiện tại
            const now = new Date();
            const startPrintTime = now.toISOString();  // Thời gian bắt đầu in
            // Cộng thêm 20 phút vào thời gian hiện tại để tính thời gian kết thúc in
            const endPrintTime = new Date(now.getTime() + 20 * 60000).toISOString();  // 20 phút = 20 * 60 * 1000 ms
            
            // Tạo log mới với các giá trị trên
            const newLog = Log.build({
                id: uuidv4(),
                startTime: startPrintTime,
                finishTime: endPrintTime,
                a4Quantity,
                a3Quantity,
                noOfCopies,
                fileId,
                printerId,
                userId
            });
            await newLog.save();
            res.status(201).json(newLog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    

    async getLog(req, res) {
        try {
            console.log("Fetching logs for studentID:", req.params.studentUserName);
            
            // Lấy danh sách log theo studentUserName
            const logs = await logService.getLogByStudentUserName(req.params.studentUserName);
            console.log("Logs found:", logs);
    
            if (logs && logs.length > 0) {
                // Định dạng từng log và chuyển đổi thành JSON
                const formattedLogs = logs.map(log => {
                    return {
                        ...log.toJSON(),
                        startPrintDate: log.startTime.toISOString().split('T')[0],
                        startPrintTime: log.startTime.toISOString().split('T')[1].split('.')[0],
                        endPrintDate: log.finishTime ? log.finishTime.toISOString().split('T')[0] : null,
                        endPrintTime: log.finishTime ? log.finishTime.toISOString().split('T')[1].split('.')[0] : null,
                    };
                });
                res.status(200).json(formattedLogs);
            } else {
                res.status(404).json({ error: "Logs not found" });
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
            res.status(500).json({ error: error.message });
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
