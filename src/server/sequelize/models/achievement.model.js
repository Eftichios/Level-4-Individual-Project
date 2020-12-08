const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('achievement', {
        achievement_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        difficulty: {
            allowNull: false,
            type: DataTypes.ENUM('easy', 'medium', 'hard')
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING
        },
        game_mode: {
            allowNull: true,
            type: DataTypes.ENUM('race', 'category', 'hunting')
        },
        achievement_description: {
            allowNull: false,
            type: DataTypes.STRING
        }
    });
};