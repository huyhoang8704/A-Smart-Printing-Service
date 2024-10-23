const { Printer } = require("../models/Printer");
const printerService = require("../services/printerService");
async function getAllPrintersHandler(req, res) {
    const response = await printerService.getAllPrinters();
    res.send(response);
}

async function getPrinterHandler(req, res) {
    const response = await printerService.getPrinterByID(req.params.printerID);
    res.send(response);
}

async function updatePrinterHandler(req, res) {
    const response = await printerService.updatePrinter(req.params.printerID, req.body);
    res.send(response);
}

async function addPrinterHandler(req, res) {
    const response = await printerService.addPrinter(req.body)
    res.send(response);
}

exports.getAllPrintersHandler = getAllPrintersHandler;
exports.updatePrinterHandler = updatePrinterHandler;
exports.addPrinterHandler = addPrinterHandler;
exports.getPrinterHandler = getPrinterHandler