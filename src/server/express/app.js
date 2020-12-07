const express = require("express");
const cors = require("cors");

// create express app
const app = express();

// use cors and allow for json responses
app.use(cors());
app.use(express.json());

// define all routes, loaded from the corresponding files
const routes = {
    users: require('./routes/users')
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

for (const [routeName, routeController] of Object.entries(routes)) {
	if (routeController.getAll) {
		app.get(`/api/${routeName}`, makeHandlerAwareOfAsyncErrors(routeController.getAll))
	};
}

app.get('/', (req, res)=>{
    res.send("test route");
})

module.exports = app;