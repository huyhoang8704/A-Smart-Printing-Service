console.log("asssociation");

const { PermittedFileType } = require("./PermittedFileType");
const PrintingLog = require("./PrintingLog");
const { SelectedPrintPage } = require("./SelectedPrintPage");
const { SystemConfig } = require("./SystemConfig");

// SystemConfig.sync({force: true})

// PermittedFileType.sync({ force: true });

SystemConfig.hasMany(PermittedFileType, {
    foreignKey: "configId",
    as: "permittedFileTypes",
});

PrintingLog.hasMany(SelectedPrintPage, {
    foreignKey: "printLogId",
});

// PermittedFileType.belongsTo(SystemConfig, {
//     foreignKey: "configId",
// });
