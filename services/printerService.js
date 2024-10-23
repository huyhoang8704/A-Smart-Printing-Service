const { where } = require("sequelize");
const { Printer } = require("../models/Printer");
const { generateUUIDV4 } = require("../utils/idManager");

async function getAllPrinters() {
    try {
        const printers = await Printer.findAll();
        console.log(printers);
        return { status: "success", data: printers };
    } catch (error) {
        console.log(error);
        return { status: "failed", error: [] };
    }
}

async function getPrinterByID(id) {
    try {
        const printer = await Printer.findOne({
            where: {
                id: id,
            },
        });
        console.log(printer);
        return { status: "success", data: printer };
    } catch (error) {
        console.log(error);
        return { status: "failed", error: [] };
    }
}

async function updatePrinter(id, data) {
    console.log("updatePrinter ", data);

    try {
        const updateResponse = await Printer.update(data, {
            where: {
                id: id,
            },
        });
        const newDataResponse = await getPrinterByID(id);
        return newDataResponse;
    } catch (error) {
        console.log(error);
        return { status: "failed", error };
    }
}

async function addPrinter(data) {
    const { model, manufacturer, type, description, room, building } = data;
    try {
        const response = await Printer.create({
            id: generateUUIDV4(),
            building: building,
            model: model,
            manufacturer: manufacturer,
            type: type,
            room: room,
            description: description,
        });
        return { status: "success", data: response };
    } catch (error) {
        console.log(error);
        return { status: "failed", error };
    }
}

exports.getAllPrinters = getAllPrinters;
exports.updatePrinter = updatePrinter;
exports.addPrinter = addPrinter;
exports.getPrinterByID = getPrinterByID;
