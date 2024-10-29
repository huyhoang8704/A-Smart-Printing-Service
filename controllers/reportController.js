const { getReport, getRevenueOfYearOverMonth } = require("../services/reportService");

async function getReportHandler(req, res) {
    console.log(req.body);
    const data = await getReport({ option: req.query.option, date: req.query.date });
    res.send(data);
}

async function getYearlyStatHandler(req, res) {
    console.log(req.body);
    const data = await getRevenueOfYearOverMonth({ year: req.params.year });
    res.send(data);
}

exports.getReportHandler = getReportHandler;
exports.getYearlyStatHandler = getYearlyStatHandler;
