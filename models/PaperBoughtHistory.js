const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const PaperBoughtHistory = sequelize.define(
    "PaperBoughtHistory",
    {
        id: {
            type: DataTypes.STRING(36),
            primaryKey: true
        },
        studenUserName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        noOfPage: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: "PaperBoughtHistories",
    }
)

module.exports = {PaperBoughtHistory}