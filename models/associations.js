console.log("asssociation");

const { PermittedFileType } = require("./PermittedFileType");
const PrintingLog = require("./PrintingLog");
const { SelectedPrintPage } = require("./SelectedPrintPage");
const { SystemConfig } = require("./SystemConfig");
const { File } = require("./File");
const User = require("./User");

// SystemConfig.sync({force: true})

// PermittedFileType.sync({ force: true });

SystemConfig.hasMany(PermittedFileType, {
    foreignKey: "configId",
    as: "permittedFileTypes",
});

PrintingLog.hasMany(SelectedPrintPage, {
    foreignKey: "printLogId",
});

PrintingLog.belongsTo(File, {
    foreignKey: "fileId"
})

PrintingLog.belongsTo(User, {
    foreignKey: "userId"
})

// PermittedFileType.belongsTo(SystemConfig, {
//     foreignKey: "configId",
// });
