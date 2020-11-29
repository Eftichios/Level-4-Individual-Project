const jwt = require("jsonwebtoken");
require("dotenv").config();


module.exports = async (req,res,next) => {
    try {
        // get token from req
        const jwt_token = req.header("token");

        // check if it exists
        if (!jwt_token) {
            return res.status(403).json("Not Authorized!");
        }

        const payload = jwt.verify(jwt_token, process.env.jwtSecret);

        req.user = payload.user;

    } catch (err) {
        console.error(err.message);
        return res.status(403).json("Not Authorized!");
    }
    next();
}