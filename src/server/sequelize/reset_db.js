const sequelize = require('./index.js');

async function reset() {
    console.log("(Re)creating database and populating tables with dummy data");

    await sequelize.sync({ force: true });

    await sequelize.models.user.bulkCreate([
        { user_name: "user_1", user_password:"Unusable", owns_plugin:true, score:10},
        { user_name: "user_2", user_password:"Unusable", owns_plugin:true, score:15},
        { user_name: "user_3", user_password:"Unusable", owns_plugin:true, score:20},
        { user_name: "user_4", user_password:"Unusable", owns_plugin:true, score:25},
        { user_name: "user_5", user_password:"Unusable", owns_plugin:true, score:30},
        { user_name: "user_6", user_password:"Unusable", owns_plugin:true, score:35}
    ]);

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

    await sequelize.models.achievement.bulkCreate([
        { difficulty: 'easy', title: 'Fastest man alive I', game_mode: 'race', 
            achievement_description: 'Play 1 race game.'},
        { difficulty: 'easy', title: 'Fastest man alive II', game_mode: 'race', 
            achievement_description: 'Play 5 race game.'},   
        { difficulty: 'easy', title: 'Fastest man alive III', game_mode: 'race', 
            achievement_description: 'Play 10 race game.'},
        { difficulty: 'medium', title: 'Fastest man alive IV', game_mode: 'race', 
            achievement_description: 'Play 25 race game.'}, 
        { difficulty: 'hard', title: 'Hide and seek I', game_mode: 'hunting', 
            achievement_description: 'Find 5 rare organisations'},
    ]);

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

    console.log("Done!")
};

reset();