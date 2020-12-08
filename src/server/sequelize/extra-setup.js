function applyExtraSetup(sequelize) {
    // here we apply the relationships between tables 
    const models = sequelize.models;
    
    // this will add a composite primary key to the user organisation table
    // it will consist of the ids of the user and organisation tables
    models.organisation.belongsToMany(models.user, { through: models.user_organisation, foreignKey:'organisation_id'});
    models.user.belongsToMany(models.organisation, { through: models.user_organisation, foreignKey:'user_id'});
}

module.exports = { applyExtraSetup };