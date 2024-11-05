const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const PrintingLog = sequelize.define(
    "PrintingLog",
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        finishTime: {
            type: DataTypes.DATE,
        },
        a4Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        a3Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        noOfCopies: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fileId: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        printerId: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        }   
    },
    {
        createdAt: false,
        tableName: "PrintingLogs"
    }
)

// PrintingLog.sync({force: true})
// PrintingLog.sync({alter: true})

module.exports = PrintingLog