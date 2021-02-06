const blocked_domains = require("./data/blocked.js");
const tracker_data = require("./data/trackerDataInfo");
const sequelize = require('./index.js');
const {getMinutesOfDates, getCategoryMap} = require('../utils/helpers');
const bcrypt = require('bcrypt');
const achievements = require('../utils/achievementData');

function createTrackerJson(){
    var trackers = {}
    Object.entries(blocked_domains).forEach(([key,value])=>{
        if (tracker_data.hasOwnProperty(key)){
            trackers[key] = {"found": false,"extra_info": true};
        }else {
            trackers[key] = {"found": false,"extra_info": false};
        }
        
    })
    return trackers
}

function createCategories(){
    var cat_labels = getCategoryMap();
    var cat_count = {}
    cat_labels.forEach((cat)=>{
        cat_count[cat] = 0
    })

    return cat_count
}


// creates the database tables and populates them with dummy data
async function reset() {
    console.log("(Re)creating database and populating tables with dummy data");
    await sequelize.sync({ force: true });

    // encrypted password for dummy users
    const salt_rounds = 10;
    const salt = await bcrypt.genSalt(salt_rounds);
    const bcrypt_password = await bcrypt.hash("123", salt);
    const trackers = createTrackerJson();

    // populates users table
    var users_db = await sequelize.models.user.bulkCreate([
        { user_name: "user_1", user_password: bcrypt_password, owns_plugin:true},
        { user_name: "user_2", user_password: bcrypt_password, owns_plugin:true},
        { user_name: "user_3", user_password: bcrypt_password, owns_plugin:true},
        { user_name: "user_4", user_password: bcrypt_password, owns_plugin:true},
        { user_name: "user_5", user_password: bcrypt_password, owns_plugin:true},
        { user_name: "user_6", user_password: bcrypt_password, owns_plugin:true}
    ], {returning: true});

    // populates organisations table
    await sequelize.models.organisation.bulkCreate([
        { organisation_name: 'dummy_org_1', organisation_location: 'dummy_loc_1', organisation_description: 'dummy_descr_1',
          points: 10, rarity: 'very common'},
        { organisation_name: 'dummy_org_2', organisation_location: 'dummy_loc_2', organisation_description: 'dummy_descr_2',
          points: 20, rarity: 'common'},
        { organisation_name: 'dummy_org_3', organisation_location: 'dummy_loc_3', organisation_description: 'dummy_descr_3',
          points: 30, rarity: 'uncommon'},
        { organisation_name: 'dummy_org_4', organisation_location: 'dummy_loc_4', organisation_description: 'dummy_descr_4',
          points: 50, rarity: 'rare'},
        { organisation_name: 'dummy_org_5', organisation_location: 'dummy_loc_5', organisation_description: 'dummy_descr_5',
          points: 100, rarity: 'very rare'}, 
        { organisation_name: 'dummy_org_6', organisation_location: 'dummy_loc_6', organisation_description: 'dummy_descr_6',
          points: 250, rarity: 'extremely rare'}, 
    ]);

    // populates achievements table
    var achievements_db = await sequelize.models.achievement.bulkCreate(achievements, {returning:true});

    var cat_count = createCategories();

    // populates user_metric table
    await sequelize.models.user_metric.bulkCreate([
        { user_id: 1, race_games: 0, category_games: 0, total_ad_trackers: 0, categories_count: cat_count, tracker_list: trackers, tracker_count: 0, score:0},
        { user_id: 2, race_games: 0, category_games: 0, total_ad_trackers: 0, categories_count: cat_count, tracker_list: trackers, tracker_count: 0, score:0},
        { user_id: 3, race_games: 0, category_games: 0, total_ad_trackers: 0, categories_count: cat_count, tracker_list: trackers, tracker_count: 0, score:0},
        { user_id: 4, race_games: 0, category_games: 0, total_ad_trackers: 0, categories_count: cat_count, tracker_list: trackers, tracker_count: 0, score:0},
        { user_id: 5, race_games: 0, category_games: 0, total_ad_trackers: 0, categories_count: cat_count, tracker_list: trackers, tracker_count: 0, score:0},
        { user_id: 6, race_games: 0, category_games: 0, total_ad_trackers: 0, categories_count: cat_count, tracker_list: trackers, tracker_count: 0, score:0},
    ]);

    // populates user_achievements table
    for (var user_index in users_db){
        var curr_user_id = users_db[user_index]["user_id"];
        for (var achiev_index in achievements_db){
            var achiev_id = achievements_db[achiev_index]["achievement_id"];
            await sequelize.models.user_achievement.create({
                user_id: curr_user_id, achievement_id: achiev_id, date_completed: null, completed: false, progress: 0
            })
        }
    }

    // populates user_organisations table
    await sequelize.models.user_organisation.bulkCreate([
        {organisation_id: 1, user_id: 1, times_found: 5, date_found_first: new Date(), 
            found_url:"dummy_url_1-1.com", acquired_from:'hunting'},
        {organisation_id: 2, user_id: 1, times_found: 2, date_found_first: new Date(), 
            found_url:"dummy_url_1-2.com", acquired_from:'hunting'},
        {organisation_id: 1, user_id: 2, times_found: 6, date_found_first: new Date(), 
            found_url:"dummy_url_2-1.com", acquired_from:'hunting'},
        {organisation_id: 2, user_id: 2, times_found: 3, date_found_first: new Date(), 
            found_url:"dummy_url_2-2.com", acquired_from:'hunting'}
    ]);

    // populate game_history table
    var dummy_trackers = "example_tracker"
    var player_data_race = {user_1: {page_history: {"www.example.com":{"count":20,"trackers": Array(20).fill(dummy_trackers)}, "www.another-example.com": {"count":15,"trackers": Array(15).fill(dummy_trackers)}, "www.lots-of-trackers.com": {"count":65,"trackers": Array(65).fill(dummy_trackers)}}, score: 100},
                        user_2: {page_history: {"www.example.com":{"count":15,"trackers": Array(15).fill(dummy_trackers)}, "www.another-example.com": {"count":10,"trackers": Array(10).fill(dummy_trackers)}, "www.lots-of-trackers.com": {"count":55,"trackers": Array(55).fill(dummy_trackers)}}, score: 80}}
 
    var player_data_category = {user_1: {categories: ["Internet and Telecom","Law and Government","Law and Government","Science", "Food and Drink", "News and Media"]},
                                user_2: {categories: ["Internet and Telecom", "Science", "Science", "Food and Drink", "Food and Drink"]}}

    var startDate = new Date("2020/08/08 15:00");
    var endDate = new Date("2020/08/08 15:13");
    var game_data_race = {time_elapsed: getMinutesOfDates(startDate, endDate), win_condition: 100}
    var game_data_category = {time_elapsed: getMinutesOfDates(startDate, endDate), win_condition: "News and Media"}

    await sequelize.models.game_history.bulkCreate([
        { winner_id: 1, winner_name: "user_1", game_mode: 'Race', game_date: new Date(), 
        player_stats: player_data_race,
        game_stats: game_data_race,
        player_ids: [1,2]}
    ,
        { winner_id: 1, winner_name: "user_1", game_mode: 'Category', game_date: new Date(), 
        player_stats: player_data_category,
        game_stats: game_data_category,
        player_ids: [1,2]}
        ]
    );

    // populate the market table
    await sequelize.models.market.bulkCreate([
        { player_1: 1, player_2: null, offering_organisation_id: 1, offerred_organisation_id: null,
            active: true, date_started: new Date(), date_finished: null, offered: false}
    ]);

    console.log("Populating tables...")
};

reset();