const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('client_logger', {
        log_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        date: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        level: {
            allowNull: false,
            type: DataTypes.STRING
        },
        msg: {
            allowNull: false,
            type: DataTypes.STRING
        },
        user: {
            allowNull: false,
            type: DataTypes.STRING
        }
    },{
        freezeTableName: true
    });
};