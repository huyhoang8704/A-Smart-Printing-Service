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
        year: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quarter: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
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

// SystemConfig.sync({alter: true})

module.exports = { SystemConfig };
