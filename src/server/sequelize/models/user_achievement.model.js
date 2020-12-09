const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('user_achievement', {
        date_completed: {
            allowNull: true,
            type: DataTypes.DATE
        },
        completed: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        },
    });
};