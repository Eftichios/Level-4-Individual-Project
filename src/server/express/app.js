const express = require("express");
const cors = require("cors");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
const save_log = require("../middleware/server_log_handler");
var morgan = require("morgan");
var fs = require('fs')
var path = require('path')

// create express app
const app = express();
morgan.token('custom_reqBody', function (req, res) { return JSON.stringify(req.body)});
morgan.token('custom_resBody', function (req, res) { return JSON.stringify(res.body)});

// set up a log to keep track of all requests
var accessLogStreamServer = fs.createWriteStream(path.join(__dirname, 'routes', 'logs',"server_log.log"), { flags: 'a' })
app.use(morgan(':method :url :status :custom_reqBody :custom_resBody :res[content-length] - :response-time ms', { stream: accessLogStreamServer, 
	skip: (req,res)=>{
		return req.url==="/api/logger"
}}))

// use cors and allow for json responses
app.use(cors());
app.use(express.json());

app.use((req,res,next)=>{
	save_log(req, res);
	next();
})

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
	market: require('./routes/market'),
	logger: require('./routes/logger'),
	category: require('./routes/category')
}

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
	return async function(req, res, next) {
		try {
			await handler(req, res);
		} catch (error) {
			console.log(error)
			res.status(500).json(`Unexpected error on the server side: ${error.message}`)
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
		app.post(`/api/startGame`, authorization, makeHandlerAwareOfAsyncErrors(routeController.startGame));
	}

	// handle logger routes
	if (routeController.logger){
		app.post(`/api/logger`, makeHandlerAwareOfAsyncErrors(routeController.logger));
	}
	if (routeController.getAllLogs){
		app.post(`/api/logger/logs`, makeHandlerAwareOfAsyncErrors(routeController.getAllLogs));
	}

	// handle category routes
	if (routeController.category){
		app.post(`/api/category`, makeHandlerAwareOfAsyncErrors(routeController.category));
	}

	//handle user_metrics search route
	if (routeController.search){
		app.post(`/api/userMetrics/search`, makeHandlerAwareOfAsyncErrors(routeController.search));
	}

};

app.get('/', (req, res)=>{
    res.send("test route");
})

module.exports = app;