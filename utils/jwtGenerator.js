const jwt = require("jsonwebtoken");
require("dotenv").config();

// generates a jwt token for a user
function jwtGenerator(user_id){
    const payload = {
        user: user_id
    }

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "8hr"});
}

module.exports = jwtGenerator;