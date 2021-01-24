const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('user_organisation', {
        times_found: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        date_found_first: {
            allowNull: true,
            type: DataTypes.DATE
        },
        found_url: {
            allowNull: true,
            type: DataTypes.STRING
        },
        acquired_from: {
            allowNull: true,
            type: DataTypes.ENUM('hunting', 'trading')
        }
    });
};