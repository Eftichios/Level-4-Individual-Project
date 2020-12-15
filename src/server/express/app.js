const express = require("express");
const cors = require("cors");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

// create express app
const app = express();

// use cors and allow for json responses
app.use(cors());
app.use(express.json());

// define all routes, loaded from the corresponding files
const routes = {
	users: require('./routes/users'),
	game: require('./routes/game'),
	organisations: require('./routes/organisations'),
	achievements: require('./routes/achievements'),
	userMetrics: require('./routes/user_metrics'),
	userAchievements: require('./routes/user_achievements'),
	userOrganisations: require('./routes/user_organisations'),
	gameHistory: require('./routes/game_history'),
	market: require('./routes/market')
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
	// handle all common routes for the controllers
	if (routeController.getAll) {
		app.get(`/api/${routeName}`, makeHandlerAwareOfAsyncErrors(routeController.getAll));
	} 
	if (routeController.getById) {
		app.get(`/api/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.getById));
	}
	if (routeController.getByName) {
		app.post(`/api/${routeName}/name`, makeHandlerAwareOfAsyncErrors(routeController.getByName));
	}
	if (routeController.update) {
		app.put(`/api/${routeName}/:id`, authorization, makeHandlerAwareOfAsyncErrors(routeController.update));
	}
	if (routeController.remove) {
		app.delete(`/api/${routeName}/:id`, authorization, makeHandlerAwareOfAsyncErrors(routeController.remove));
	}
	if (routeController.create) {
		app.post(`/api/${routeName}`, authorization, makeHandlerAwareOfAsyncErrors(routeController.create));
	}

	// handle athorisation routes
	if (routeController.register) {
		app.post(`/api/auth/register`, validInfo, makeHandlerAwareOfAsyncErrors(routeController.register));
	}
	if (routeController.login) {
		app.post(`/api/auth/login`, validInfo, makeHandlerAwareOfAsyncErrors(routeController.login));
	}
	if (routeController.isVerified) {
		app.get(`/api/auth/isVerified`, authorization, makeHandlerAwareOfAsyncErrors(routeController.isVerified));
	}

	// handle game play routes 
	if (routeController.findGame){
		app.post(`/api/play`, authorization, makeHandlerAwareOfAsyncErrors(routeController.findGame));
	}

	if (routeController.startGame){
		app.post(`/api/startGame`, authorization, makeHandlerAwareOfAsyncErrors(routeController.startGame))
	}


};

app.get('/', (req, res)=>{
    res.send("test route");
})

module.exports = app;