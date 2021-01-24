const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('organisation', {
        organisation_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        organisation_name: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        organisation_location: {
            allowNull: false,
            type: DataTypes.STRING
        },
        organisation_description : {
            allowNull: false,
            type: DataTypes.STRING
        },
        points: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        rarity: {
            allowNull: false,
            type: DataTypes.ENUM('very common', 'common', 'uncommon', 'rare', 'very rare', 'extremely rare')
        }
    });
};