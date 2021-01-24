function applyExtraSetup(sequelize) {
    // here we apply the relationships between tables 
    const models = sequelize.models;
    
    // this will add a composite primary key to the user_organisations table
    // it will consist of the ids of the users and organisations tables
    models.organisation.belongsToMany(models.user, { through: models.user_organisation, foreignKey:'organisation_id'});
    models.user.belongsToMany(models.organisation, { through: models.user_organisation, foreignKey:'user_id'});

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

    // add associations to the market table
    models.market.belongsTo(models.user, {foreignKey: 'player_1'});
    models.market.belongsTo(models.user, {foreignKey: 'player_2'});
    models.market.belongsTo(models.organisation, {foreignKey: 'offering_organisation_id'});
    models.market.belongsTo(models.organisation, {foreignKey: 'offerred_organisation_id'});
}

module.exports = { applyExtraSetup };