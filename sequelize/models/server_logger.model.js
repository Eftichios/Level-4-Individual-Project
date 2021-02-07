const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('server_logger', {
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
        method: {
            allowNull: false,
            type: DataTypes.STRING
        },
        endpoint: {
            allowNull: false,
            type: DataTypes.STRING
        },
        req_body: {
            allowNull: false,
            type: DataTypes.STRING
        },
        res_body: {
            allowNull: false,
            type: DataTypes.STRING
        }
    },{
        freezeTableName: true
    });
};