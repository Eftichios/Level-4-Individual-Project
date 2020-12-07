const { Sequelize } = require('sequelize');
// const { applyExtraSetup } = require('./extra-setup');
require("dotenv").config();


const sequelize = new Sequelize(`postgres://postgres:${process.env.db_pass}@${process.env.db_host}:${process.env.db_port}/${process.env.db_name}`);
sequelize.options.logging = false;

// load all of our models
const modelDefiners = [
    require('./models/user.model')
]

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

// if any extra configuration is needed add it
// applyExtraSetup(sequelize);

module.exports = sequelize;
