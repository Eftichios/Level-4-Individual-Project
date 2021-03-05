const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');
require("dotenv").config();

const dev_config = `postgres://postgres:${process.env.db_pass}@${process.env.db_host}:${process.env.db_port}/${process.env.db_name}`;
const pro_config = process.env.DATABASE_URL

const db_config = process.env.NODE_ENV === "production"? pro_config:dev_config;
console.log("Database url: ", db_config);
// initialise the orm
const sequelize = new Sequelize(db_config,
{
    logging: false,
    define: {timestamps: false}
});

// load all of our models
const modelDefiners = [
    require('./models/user.model'),
    require('./models/organisation.model'),
    require('./models/achievement.model'),
    require('./models/user_metric.model'),
    require('./models/user_achievement.model'),
    require('./models/user_organisation.model'),
    require('./models/game_history.model'),
    require('./models/market.model'),
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
