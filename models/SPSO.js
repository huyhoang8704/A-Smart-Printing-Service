const { DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const SPSO = sequelize.define(
    "SPSO",
    {
        // id: {
        //     type: DataTypes.STRING(36),
        //     allowNull: false,
        //     primaryKey: true
        // },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: "SPSO",
        },
    },
    {
        createdAt: false,
        tableName: "SPSO",
    }
);

// SPSO.sync({alter: true})

module.exports = SPSO;
