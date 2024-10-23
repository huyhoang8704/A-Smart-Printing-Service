console.log("asssociation");

const { PermittedFileType } = require("./PermittedFileType");
const { SystemConfig } = require("./SystemConfig");

// SystemConfig.sync({force: true})

// PermittedFileType.sync({ force: true });

SystemConfig.hasMany(PermittedFileType, {
    foreignKey: "configId",
    as: "permittedFileTypes"
});

// PermittedFileType.belongsTo(SystemConfig, {
//     foreignKey: "configId",
// });
