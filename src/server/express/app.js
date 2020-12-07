const express = require("express");
const cors = require("cors");

// create express app
const app = express();

// use cors and allow for json responses
app.use(cors());
app.use(express.json());

// define all routes, loaded from the corresponding files
const routes = {
    authentication: require('./routes/jwtAuth'),
    dashboard: require('./routes/dashboard')
}

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
	return async function(req, res, next) {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
		}
	};
}

app.get('/', (req, res)=>{
    res.send("test route");
})

module.exports = app;