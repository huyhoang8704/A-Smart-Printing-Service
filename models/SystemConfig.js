const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const SystemConfig = sequelize.define(
    "SystemConfig",
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
            allowNull: false,
        },
        year:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quarter: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        defaultNoPages: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        renewDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        createdAt: false,
        tableName: "SystemConfigs",
    }
);


module.exports = { SystemConfig };
