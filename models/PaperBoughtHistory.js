const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const PaperBoughtHistory = sequelize.define(
    "PaperBoughtHistory",
    {
        id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        noOfPage: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalBill: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("paid", "cancelled", "unpaid"),
            defaultValue: "unpaid",
        },
        // createdAt is default
    },
    {
        tableName: "PaperBoughtHistories",
    }
);
PaperBoughtHistory.sync({alter: true})

module.exports = { PaperBoughtHistory };
