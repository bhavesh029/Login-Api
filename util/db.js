const sequelize = require('sequelize');

const Sequelize = new sequelize('ToDo','bhavesh','Bhavesh#1998', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = Sequelize;