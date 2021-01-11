const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('game_history', {
        game_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        game_mode: {
            allowNull: false,
            type: DataTypes.ENUM('Race', 'Category', 'Hunting'),
        },
        game_date: {
            allowNull: false,
            type: DataTypes.DATE
        },
        player_stats: {
            allowNull: false,
            type: DataTypes.JSONB
        },
        game_stats: {
            allowNull: false,
            type: DataTypes.JSONB
        },
        player_ids: {
            allowNull: false,
            type: DataTypes.ARRAY(DataTypes.INTEGER)
        }
    },{
        freezeTableName: true
    });
};