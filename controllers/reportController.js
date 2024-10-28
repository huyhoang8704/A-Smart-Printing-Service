const { getReport } = require("../services/reportService")

async function getReportHandler (req, res) {
    console.log(req.body);
    
    const data = await getReport(req.body);
    res.send(data)
}

exports.getReportHandler = getReportHandler