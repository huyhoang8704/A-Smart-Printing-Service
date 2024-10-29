const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const File = sequelize.define(
    "File",
    {
        id: {
            primaryKey: true,
            type: DataTypes.STRING(36)
        },
        fileName: {
            type: DataTypes.STRING,
        },
        fileType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        noOfPages: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        studentUserName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        createdAt: false,
        tableName: "Files"
    }
)


module.exports = {File}