const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/mysql.database");

const User = sequelize.define(
    "User",
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "users",
        // hooks: {
        //     beforeValidate: (user, options) => {
        //         if (options.isNewRecord) {
        //             if (!user.username) {
        //                 throw new Error("Username is required when creating a new user.");
        //             }
        //             if (!user.password) {
        //                 throw new Error("Password is required when creating a new user.");
        //             }
        //             if (!user.name) {
        //                 throw new Error("Name is required when creating a new user.");
        //             }
        //         } else {
        //             throw new Error("User data cannot be modified.");
        //         }
        //     },
        // },
    }
);

module.exports = User;
