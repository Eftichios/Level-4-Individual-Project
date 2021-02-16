function applyExtraSetup(sequelize) {
    // here we apply the relationships between tables 
    const models = sequelize.models;

    // add foreign key association to user_metrics table
    models.user.hasOne(models.user_metric, {foreignKey: 'user_id'});
    models.user_metric.belongsTo(models.user, {foreignKey: 'user_id'})
    models.user_metric.removeAttribute('id');

    // this will add a composite primary key to the user_achievements table
    // it will consist of the ids of the users and achievements tables
    models.achievement.belongsToMany(models.user, { through: models.user_achievement, foreignKey:'achievement_id'});
    models.user.belongsToMany(models.achievement, { through: models.user_achievement, foreignKey:'user_id'});

    // add foreign key association to game_history table
    models.user.hasMany(models.game_history, {foreignKey: 'winner_id'});
}

module.exports = { applyExtraSetup };