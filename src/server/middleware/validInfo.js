module.exports = (req, res, next) => {
    const {name, password} = req.body;

    // check if we have any empty values for name or password
    if (req.path === "/register" || req.path === "/login") {
        if (![name, password].every(Boolean)){
            return res.status(401).json("Missing Credentials")
        }
    } 

    next();
};