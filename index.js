const app = require('./express/app');
const express = require("express");
const cors = require('cors');
const sequelize = require('./sequelize');
const PORT = process.env.PORT || 5000;
const path = require('path')
const {setUpSocketCommunication} = require('./extension_socket');

app.use(cors())

if (process.env.NODE_ENV==="production") {
	app.use(express.static(path.join(__dirname, "client/build")));
}

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
	cors: {
		origin: "http://localhost:3000"
	}
});

// connect to the database
async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		console.log('Database connection OK!');
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}

// initialise server, database and initial socket events
async function init() {
	await assertDatabaseConnectionOk();

	await setUpSocketCommunication(io);

	console.log(`Starting Sequelize + Express on port ${PORT}...`);

	httpServer.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}.`);
	});
}

init();
