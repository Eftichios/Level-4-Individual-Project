const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('user', {
        user_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_name: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
            // optional: validate username with some criteria
        },
        user_password: {
            allowNull: false,
            type: DataTypes.STRING
        },
        owns_plugin: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        },
        profile_picture:{
            allowNull: false,
            type: DataTypes.STRING,
        }
    });
};