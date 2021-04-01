## A distributed game using trackers and adverts in Web Browsers.

### Trackers
Trackers are the entities that track the users when they are browsing the web, usually by embedding content (content that has scripts attached to it) in the website such as pixel images that are invisible to the user or by using cookies to capture behavioural data such as where the user clicked or their browsing history, or capture demographics such as age or gender. This data is then shared with advertisers.

### Advertisers
Advertisers are the entities that are interested in promoting a service or product through adverts. The advertisers use the data that the trackers gather to profile the user in order to target them with personalised adverts that they assume the user would be more interested in. 

### The Project
For this project, we use trackers and adverts as game entities to build a game with the purpose of improving transparency on how trackers track the user and collect their data and what targeted advertising is and how it works, as well as exposing the user to the privacy issues involved in targeted advertising. Additionally, we explore the knowledge that users already have, so that we can evaluate if their knowledge has improved after playing the game. 

### Implementation
This game is implemented as a web app along with a chrome extension. The technologies used are the PERN stack (Postgresql, Express, React, Node.js) for the web app and vanilla javascript and the chrome api for the chrome extension.
The web app allows users to create accounts to play the game. Users can earn achievements, view their gamehistory, view their gameplay metrics (e.g trackers found), as well as view the leadboards which ranks players based on how many unique trackers they have been tracked by while playing.
The chrome extension is necessary to update the game state while playing by identifying trackers or adverts (depending on the game mode), as we need monitor the user's HTTP requests as well as access the DOM of pages they visit.
In short, this is how it works: 
* The player creates an account and installs the corresponding chrome extension. Using websockets, we establish a three way communication between the server, the client and the chrome extension (diagram).
* When a player searches for a game, they are put in a lobby, which corresponds to a websocket room. If more players join the same lobby, they are put in the same room. This allows players to chat with each other as well as send updates to each other while playing.
* Inside the lobby, players must indicate they are ready. When all players are ready, any one of them can start the game.
* When the game starts, an event is emmited to all chrome extensions that belong to players inside the lobby notifying them that the game has started.
* The chrome extension handles all gameplay logic (see game mode section for more detail). Additionally, when a player updates their score, the chrome extension notifies the server and the server in turn notifies all other players. This ensures that all players have the updated game state.
* When a winner is found, the chrome extension notifies the server and the server notifies all players that the game is over and a winner was found. The server also notifies the client (again through websockets) that the game is over so that players can get redirected to the summary.
* Inside the summary, the server uses the final game state to build gameplay metrics that the players can see. Additionaly, the server uses the game state to update each player's metrics as well as update their achievements.

### Game modes
**Race:** In this game mode, players are given a number of unique trackers inside the lobby that they need to get tracked by in order to win the game (e.g "Get tracked by 100 unique ad trackers). When the game starts, players visit websites in order to get tracked by as many trackers as possible. Trackers can be found in all types of websites, but some websites contain a lot more tracking than others. The players can view relevant gameplay metrics from the extensions interface. They can see how many trackers they and the other players have been tracked by so far. When a winner is found, the extension updates its status and displays a notification so that the players know that the game is over.

**Category:** In this game mode, players are given an advert category inside the lobby. The purpose of this game mode is to browse the web in a calculated way such that you get targeted with an advert that belongs to the category given. When the game starts, players visit websites related to the given category, so they can be flagged as being interested in that category. For example, if the given category is Food, the player might visit food blogs or restaurants. The extension will try to identify adverts on the page and categorise them. 

### How it works:
**Race:** During gameplay, the chrome extension looks at the network requests made from each website the player visits during gameplay. The domain of those requests is extracted and compared with a list of known tracker domains. If a request is made to a domain in that list, we know that it is a tracker and update the player's score accordingly.

**Category:** During gameplay, the chrome extension looks at the DOM of each website the player visits during gameplay. It identifies potential elements that could be adverts and extracts their redirection url. We then use that url to categorise the content of the landing page into high level categories such as Science or Sports by using a web categorisation API.

### Limitations
While the extension manages to identify most trackers, there are still trackers that won't be identified due to the fact that the list of known trackers is not exhaustive. Furthermore, in categorising adverts, not only can adverts not be identified, the extracted categories are not always accurate. This means that sometimes during gameplay, you might see an advert on the given category first but still not win if the extension fails to identify that advert. This can cause some frustrations but the nature of this game is experimental and educational and it should still provide useful insights into what happens behind the scenes when browsing the web.

### Setup
Instructions on building the web app locally: (Note that to fully build the web app, a database connection to a Postgresql server is needed).
* Clone the master repository
* Open a cmd/bash inside the server directory
* Run `npm install`
* Do the same for the client directory
* In the server directory, create a file called `.env` which would contain the env variables
* Insert your database credentials (valid PostgreSQL database connection) and a secret key (could be anything) in `.env`. Example screenshot included below:

![image](https://user-images.githubusercontent.com/25393883/113272947-0df7d580-92d4-11eb-9d36-bbd09fab54d8.png)

* Init the database and populate it with dummy data by running `node sequelize/rest_db.js` inside the server dir
* Start the node server by running `node index.js` inside the server dir
* Start the React app by runnung `npm start` inside the client dir
* Navigate to the corresponding local host url that the React app is running on
* See instructions below to set up and play the game. Note that they are for the deployed app and in the local version, you should use the extension that you cloned from the repository to play the game.

Instructions on playing the deployed app: [https://docs.google.com/document/d/1zIbCuwDIHwgJgykpyYQw8kPiVyl4iTkQkJvB8PoyrjY/edit?usp=sharing](Instructions)
