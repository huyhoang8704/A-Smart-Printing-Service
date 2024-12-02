console.log("asssociation");

const { PermittedFileType } = require("./PermittedFileType");
const { PrintingLog } = require("./PrintingLog");
const { SelectedPrintPage } = require("./SelectedPrintPage");
const { SystemConfig } = require("./SystemConfig");
const { File } = require("./File");
const { Printer } = require("./Printer");
const User = require("./User");

// SystemConfig.sync({force: true})

// PermittedFileType.sync({ force: true });

SystemConfig.hasMany(PermittedFileType, {
    foreignKey: "configId",
    as: "permittedFileTypes",
});

PrintingLog.hasMany(SelectedPrintPage, {
    foreignKey: "printLogId",
    onDelete: "CASCADE",
});

PrintingLog.belongsTo(File, {
    foreignKey: "fileId",
    onDelete: "CASCADE",
});

PrintingLog.belongsTo(User, {
    foreignKey: "userId",
});

PrintingLog.belongsTo(Printer, {
    foreignKey: "printerId",
    onDelete: "CASCADE",
});

// PermittedFileType.belongsTo(SystemConfig, {
//     foreignKey: "configId",
// });
