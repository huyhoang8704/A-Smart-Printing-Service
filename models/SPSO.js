const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const SPSO = sequelize.define(
    "SPSO",
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
        }

    },
    {
        createdAt: false,
        tableName: "SPSO"
    }
)

module.exports = {SPSO}