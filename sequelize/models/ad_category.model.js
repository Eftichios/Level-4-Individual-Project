const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('ad_category', {
        ad_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        ad_url: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        categories: {
            allowNull: false,
            type: DataTypes.ARRAY(DataTypes.STRING)
        }
    });
};