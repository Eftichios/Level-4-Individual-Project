const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('bug_report', {
        bug_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        date: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        description: {
            allowNull: false,
            type: DataTypes.STRING(2048)
        },
        user: {
            allowNull: false,
            type: DataTypes.STRING
        }
    },{
        freezeTableName: true
    });
};