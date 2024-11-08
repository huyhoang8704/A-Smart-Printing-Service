const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const SelectedPrintPage = sequelize.define(
    "SelectedPrintPage",
    {
        fileId: {
            type: DataTypes.STRING(36),
            allowNull: false,
        },
        pageNumber: {
            type: DataTypes.MEDIUMINT,
            primaryKey: true,
        },
        printLogId: {
            type: DataTypes.STRING(36),
            primaryKey: true,
        },
    },
    {
        createdAt: false,
        updatedAt: false,
        tableName: "SelectedPrintPages",
    }
);
// SelectedPrintPage.sync({force: true})

module.exports = {SelectedPrintPage}
