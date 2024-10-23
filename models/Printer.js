const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const Printer = sequelize.define(
    "Printer",
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING(36),
        },
        description: {
            type: DataTypes.TEXT,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        building: {
            type: DataTypes.STRING,
        },
        room: {
            type: DataTypes.STRING,
        },
        manufacturer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("black", "color"),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("disabled", "available", "running"),
            defaultValue: "available"
        },
    },
    {
        createdAt: false,
        tableName: "Printers",
    }
);
module.exports = { Printer };
