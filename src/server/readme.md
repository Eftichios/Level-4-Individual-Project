This directory contains the server's source files. All required packages used by the server are found in `package.json` and can be installed by executing `npm install`.

## Directories

* **express**: Contains all the source code files to set up the REST API routes.
* **middleware**: All of the middleware used by the server.
* **sequelize**: Contains code to define all database models as well as set up and populate the database.
* **test**: The server's the unit tests.
* **utils**: Utility classes and functions that the server uses to handle its logic.


## Files
* **extension_socket.js**: Defines a socket event used to identify extension sockets.
* **index.js**: The main file of the server. Executing `node index.js` starts the server on port 5000 (needs database credentials defined).
* **package.json**: Contains the packages needed to run the server.
* **test.js**: Defines the order of which the test suites are executed.
