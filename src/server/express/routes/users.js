const { models } = require('../../sequelize');
const bcrypt = require('bcrypt');
const jwtGenerator = require("../../utils/jwtGenerator");
const validInfo = require("../../middleware/validInfo");
const authorization = require("../../middleware/authorization");

async function getAll(req, res) {
    const users = await models.user.findAll();
    console.log(users);
    res.status(200).json(users);
}

module.exports = {
    getAll
}