const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('user_metric', {
        race_games: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        category_games: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        total_ad_trackers: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        categories_count: {
            allowNull: false,
            type: DataTypes.ARRAY(DataTypes.INTEGER)
        },
        tracker_list: {
            allowNull: false,
            type: DataTypes.JSONB
        },
        tracker_count: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        score: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
    });
};