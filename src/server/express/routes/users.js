const { models } = require('../../sequelize');
const bcrypt = require('bcrypt');
const jwtGenerator = require("../../utils/jwtGenerator");
const { getIdParam } = require('../../utils/helpers');


async function getAll(req, res) {
    const users = await models.user.findAll({attributes: ['user_id','user_name','owns_plugin','score']});
    res.status(200).json(users);
}

async function getById(req, res) {
    const user_id = getIdParam(req);
    const user = await models.user.findByPk(user_id, {attributes: ['user_id','user_name','owns_plugin','score']});
    if (user){
        res.status(200).json(user);
    } else {
        res.status(404).json('No user exists with the given id.');
    }
}

async function getByName(req, res) {
    const user = await models.user.findOne({where: {user_name: req.body.user_name}, attributes: ['user_id','user_name','owns_plugin','score']})
    if (user){
        res.status(200).json(user);
    } else {
        res.status(404).json('No user exists with the given user name.');
    }
}

async function update(req, res) {
    const user_id = getIdParam(req); 

    // check if body user id is same as param id 
    if (req.body.id === user_id) {
        await models.user.update({user_password: req.body.passowrd}, {where: {user_id: user_id}});
        res.status(200).json("Password changed succesfully.")
    } else {
        res.status(400).json(`Bad request: param ID (${user_id}) does not match body ID (${req.body.id}).`)
    }
}

async function remove(req, res) {
    const id = getIdParam(req);
    
    await models.user.destroy({
        where: {
            user_id:id
        }
    });
}

async function register(req, res) {
        // get name and pass out of body
        const {user_name, password, owns_plugin} = req.body;

        // check if user exists (throw error in this case)
        const user = await models.user.findOne({where: {user_name: user_name}});
        if (user){
            res.status(401).json("User with that user name already exists")
        }

        // Bcrypt the password
        const salt_rounds = 10;
        const salt = await bcrypt.genSalt(salt_rounds);
        const bcrypt_password = await bcrypt.hash(password, salt);

        // insert user inside database

        const newUser = await models.user.create({"user_name":user_name, "user_password":bcrypt_password, "owns_plugin":owns_plugin, "score":0})

        // generate jwt token
        const token = jwtGenerator(newUser.user_id);

        res.json({token});
    }

async function login(req, res) {
    // get details out of req body

    const {user_name, password} = req.body;

    // check if user does not exist (throw error if user does not exist)

    const user = await models.user.findOne({where: {user_name: user_name}});
    if (!user){
        return res.status(401).json("No such user exists");
    }

    // check if req password is the same as db password
        
    const validPassword = await bcrypt.compare(password, user.user_password);
    console.log(validPassword);
    if (!validPassword){
        return res.status(401).json("Incorrect password");
    }

    // give the user a jwt token
    const token = jwtGenerator(user.user_id);

    res.json({token});
}

async function isVerified(req, res) {
    // if we reach here then user is verified
    // we can return the id of the user in order to be able to use it throughtout the app
    res.json({'success': true, 'user_id': req.user});
}

module.exports = {
    getAll,
    getById,
    getByName,
    register,
    login,
    isVerified,
    update,
    remove
}