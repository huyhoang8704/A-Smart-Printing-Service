import { DataTypes } from "sequelize";
import sequelize from "../config/mysql.database";

const User = sequelize.define('User',{
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true, // Tự động tăng
        allowNull : false,
        primaryKey : true
    },
    fullname: {
        type : DataTypes.STRING,
        allowNull : false
    }, 
    username :{
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    numberPage : {
        type : DataTypes.INTEGER
    },
    role: {
        type: DataTypes.ENUM("student", "lecturer"),
        allowNull: false,
        defaultValue: "student" 
    },
    token : {
        type : DataTypes.STRING,
        allowNull : true
    },
    deleted : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
    }

}, {
    tableName : 'users',
    timestamps : true // createdAt, updatedAt
})

export default User