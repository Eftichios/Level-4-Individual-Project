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
            type: DataTypes.ENUM('Easy', 'Medium', 'Hard')
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING
        },
        game_mode: {
            allowNull: false,
            type: DataTypes.ENUM('Race', 'Category', 'Hunting')
        },
        achievement_description: {
            allowNull: false,
            type: DataTypes.STRING
        },
        condition: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        code: {
            allowNull: false,
            type: DataTypes.ENUM('race_mode','category_mode','total_trackers','unique_trackers', 'games_won_race', 'games_won_category', 'total_adverts')
        }
    });
};