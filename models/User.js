const DataTypes = require("sequelize")
const sequelize = require("../config/mysql.database")

const User = sequelize.define('User',{
    id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true
      },
    uniId: {
        type: DataTypes.STRING(7),
        allowNull: false,
    },
    fullName: {
        type : DataTypes.STRING,
        allowNull : false
    }, 
    email :{
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
    lastSemPaperReceive: {
        type : DataTypes.TEXT,
    },
    deleted : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
    }

}, {
    tableName : 'users',
    timestamps : true // createdAt, updatedAt
})

// User.sync({alter: true})

module.exports = User