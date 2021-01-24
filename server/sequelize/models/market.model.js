const { DataTypes, BOOLEAN } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('market', {
        trade_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        active: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
        },
        date_started: {
            allowNull: false,
            type: DataTypes.DATE
        },
        date_finished: {
            allowNull: true,
            type: DataTypes.DATE
        },
        offered: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        }
    },{
        freezeTableName: true
    });
};