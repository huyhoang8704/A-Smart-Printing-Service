const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const Student = sequelize.define(
    "Student",
    {
        username: {
            primaryKey: true,
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        noPages: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        studentId: {
            type: DataTypes.STRING(7),
            allowNull: false,
        }
    },
    {
        createdAt: false,
        tableName: "Students"
    }
)

module.exports = {Student}