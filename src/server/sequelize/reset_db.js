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
    ])

    console.log("Done!")
};

reset();