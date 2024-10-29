const DataTypes = require("sequelize")
const sequelize = require("../config/mysql.database")

const User = sequelize.define('User',{
    id: {
        type: DataTypes.STRING(16),
        allowNull: false,
        primaryKey: true
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
    deleted : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
    }

}, {
    tableName : 'users',
    timestamps : true // createdAt, updatedAt
})

module.exports = User