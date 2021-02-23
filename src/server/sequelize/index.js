const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');
require("dotenv").config();


// initialise the orm
const sequelize = new Sequelize(`postgres://${process.env.db_user}:${process.env.db_pass}@${process.env.db_host}:${process.env.db_port}/${process.env.db_name}`,
{
    logging: false,
    define: {timestamps: false}
});

// load all of our models
const modelDefiners = [
    require('./models/user.model'),
    require('./models/achievement.model'),
    require('./models/user_metric.model'),
    require('./models/user_achievement.model'),
    require('./models/game_history.model'),
    require('./models/ad_category.model'),
    require('./models/client_logger.model'),
    require('./models/extension_logger.model'),
    require('./models/server_logger.model'),
    require('./models/bug_report.model')
]

// define all the models
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

// if any extra configuration is needed add it
applyExtraSetup(sequelize);

module.exports = sequelize;
