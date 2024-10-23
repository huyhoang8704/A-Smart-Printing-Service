const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");
const { SystemConfig } = require("./SystemConfig");

const PermittedFileType = sequelize.define(
    "PermittedFileType",
    {
        configId:  {
            primaryKey: true,
            references: {
                model: "SystemConfigs", // Name of the target model (table A)
                key: 'id',
            },
            type: DataTypes.STRING,
        },
  
        fileType: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
    },
    {
        createdAt: false,
        tableName: "PermittedFileTypes",
    }
);



module.exports = { PermittedFileType };
