const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

// register route
router.post("/register", validInfo, async (req,res)=>{
    try{
        // get name and pass out of body
        const {name, password} = req.body;

        // check if user exists (throw error in this case)
        const user = await pool.query("SELECT * FROM users WHERE user_name=$1",[name]);
        if (user.rows.length !== 0){
            return res.status(401).json("User with that user name already exists")
        }

        // Bcrypt the password
        const salt_rounds = 10;
        const salt = await bcrypt.genSalt(salt_rounds);
        const bcrypt_password = await bcrypt.hash(password, salt);

        // insert user inside database

        const newUser = await pool.query("INSERT INTO users(user_name,user_password) VALUES ($1,$2) RETURNING *",
        [name, bcrypt_password]);

        // generate jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({token});

    } catch (err){
        console.error(err.message)
        res.status(500).json("Server Error");
    }
})

// login route
router.post("/login", validInfo,  async (req,res)=>{
    try{
        // get details out of req body

        const {name, password} = req.body;

        // check if user does not exist (throw error if user does not exist)

        const user = await pool.query("SELECT * FROM users WHERE user_name=$1",[name]);
        if (user.rows.length === 0){
            return res.status(401).json("No such user exists");
        }

        // check if req password is the same as db password
        
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        console.log(validPassword);
        if (!validPassword){
            return res.status(401).json("Incorrect password");
        }

        // give the user a jwt token
        const token = jwtGenerator(user.rows[0].user_id);

        res.json({token});

    } catch (err){
        console.error(err.message);
        res.status(500).json("Server Error")
    }
})

// check if user is verified
router.get("/is-verify", authorization, async (req, res)=>{
    try {
        // if we reach here, then the user is authorized
        res.json(true);

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error")
    }
})

module.exports = router;