// checks if the info given on register/login is valid
// further validation can be added here
module.exports = (req, res, next) => {
    const {user_name, password} = req.body;
    // check if we have any empty values for name or password
    if (req.path === "/api/auth/register" || req.path === "/api/auth/login") {
        if (![user_name, password].every(Boolean)){
            return res.status(401).json("Missing Credentials")
        }
    } 

    next();
};