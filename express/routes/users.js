const { models } = require('../../sequelize');
const bcrypt = require('bcrypt');
const jwtGenerator = require("../../utils/jwtGenerator");
const { getIdParam, getCategoryMap } = require('../../utils/helpers');
const trackers = require('../../utils/global')
const possible_profiles = ['blue_bot.svg', 'cyan_bot.svg',
                        'red_bot.svg', 'green_bot.svg',
                        'grey_bot.svg', 'lilah_bot.svg',
                        'purple_bot.svg', 'red_bot.svg', 'yellow_bot.svg']
var passwordValidator = require('password-validator');
var schema = new passwordValidator();

schema.is().min(6);

function createCategories(){
    var cat_labels = getCategoryMap();
    var cat_count = {}
    cat_labels.forEach((cat)=>{
        cat_count[cat] = 0
    })

    return cat_count
}

async function initAchievements(user_id){
    const achievements = await models.achievement.findAll();
    for (var achiev_index in achievements){
        var achiev_id = achievements[achiev_index]["achievement_id"];
        await models.user_achievement.create({
            user_id: user_id, achievement_id: achiev_id, date_completed: null, completed: false, progress: 0
        })
    }
}

async function getAll(req, res) {
    const users = await models.user.findAll({attributes: ['user_id','user_name','owns_plugin','profile_picture']});
    res.status(200).json(users);
}

async function getById(req, res) {
    const user_id = getIdParam(req);
    const user = await models.user.findByPk(user_id, {attributes: ['user_id','user_name','owns_plugin','profile_picture']});
    if (user){
        res.status(200).json(user);
    } else {
        res.status(404).json('No user exists with the given id.');
    }
}

async function getByName(req, res) {
    const user = await models.user.findOne({where: {user_name: req.body.user_name}, attributes: ['user_id','user_name','owns_plugin','profile_picture']})
    if (user){
        res.status(200).json(user);
    } else {
        res.status(404).json('No user exists with the given user name.');
    }
}

async function update(req, res) {
    const param_user_id = getIdParam(req); 
    const {old_pass, new_pass, user_id} = req.body;

    // check if body user id is same as param id 
    if (param_user_id === user_id) {
        
        // get the user form the db
        var user = await models.user.findOne({where: {user_id: user_id}});
        if (!user){
            res.status(404).json({success: false, msg: "No user found with the given id"});
            return;
        }

        if (!schema.validate(new_pass)){
            res.status(400).json({success: false, msg: "Password should be at least 6 characters long."});
            return
        }

        var hash_pass = user.user_password;

        const match = await bcrypt.compare(old_pass, hash_pass);
        if (!match){
            res.status(400).json({success: false, msg: "Old password does not match user's password."})
            return
        }
        
        // Bcrypt the password
        const salt_rounds = 10;
        const salt = await bcrypt.genSalt(salt_rounds);
        const bcrypt_password = await bcrypt.hash(new_pass, salt);
        await models.user.update({user_password: bcrypt_password}, {where: {user_id: user_id}});
        res.status(200).json({success: true, msg: "Password changed succesfully."})
    } else {
        res.status(400).json({success: false, msg: `Bad request: param ID (${user_id}) does not match body ID (${req.body.id}).`})
    }
}

async function update_profile(req, res){
    const param_user_id = getIdParam(req);
    const {icon_path, user_id} = req.body;

    // check if param user id matches body user id 
    if (param_user_id === user_id) {

        // find the user
        var user = await models.user.findOne({where: {user_id: user_id}});
        if (!user){
            res.status(404).json({success: false, msg: "No user found with the given id"});
            return;
        }

        // check that the new profile icon path is valid
        if (!possible_profiles.includes(icon_path)){
            res.status(400).json({success: false, msg: "Invalid profile picture path"});
            return;
        }
        await models.user.update({profile_picture: icon_path}, {where: {user_id: user_id}});
        res.status(200).json({success: true, msg: "Profile picture changed succesfully.", profile_picture: icon_path})
    }
}

async function remove(req, res) {
    const param_id = getIdParam(req);
    const body_id = req.body.user_id;

    if (param_id!==body_id){
        res.status(400).json("Param id does not match body id")
    }

    await models.user.destroy({
        where: {
            user_id:body_id
        }
    });
    res.status(200).json("User deleted succesfully.")
}

async function register(req, res) {
        // get name and pass out of body
        const {user_name, password, confirm_password, owns_plugin} = req.body;

        if (!schema.validate(password)){
            res.status(401).json("Password should be at least 6 characters long.");
            return
        } else if (!schema.validate(user_name+ "123")){
            res.status(401).json("User name should be at least 3 characters long.");
            return
        }

        // check if user exists (throw error in this case)
        const user = await models.user.findOne({where: {user_name: user_name}});
        if (user){
            res.status(401).json("User with that user name already exists")
            return
        }

        if (password!==confirm_password){
            res.status(401).json("Passwords do not match")
            return
        }

        // Bcrypt the password
        const salt_rounds = 10;
        const salt = await bcrypt.genSalt(salt_rounds);
        const bcrypt_password = await bcrypt.hash(password, salt);

        // insert user inside database
        var cat_count = createCategories();
        const newUser = await models.user.create({"user_name":user_name, "user_password":bcrypt_password, "owns_plugin":owns_plugin, "profile_picture":"blue_bot.svg"})
        await models.user_metric.create({ user_id: newUser.user_id, race_games: 0, category_games: 0, total_ad_trackers: 0, categories_count: cat_count, tracker_list: trackers, tracker_count: 0, score:10})
        await initAchievements(newUser.user_id);

        // generate jwt token
        const token = jwtGenerator(newUser.user_id);

        res.status(200).json({"token":token, "user_id":newUser.user_id});
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
    if (!validPassword){
        return res.status(401).json("Incorrect password");
    }

    // give the user a jwt token
    const token = jwtGenerator(user.user_id);

    res.status(200).json({"token":token, "user_id":user.user_id});
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
    remove,
    update_profile
}