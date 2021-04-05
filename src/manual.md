### Setup
Instructions on building the web app locally: (Note that to fully build the web app, a database connection to a Postgresql server is needed as well as Node.js and npm).
* Clone the master repository
* Open a cmd/bash inside the `src/server` directory
* Run `npm install`
* Do the same for the `src/client` directory
* In the server directory, create a file called `.env` which would contain the env variables
* Insert your database credentials (valid PostgreSQL database connection) and a secret key (could be anything) in `.env`. Example screenshot included below:

![image](https://user-images.githubusercontent.com/25393883/113272947-0df7d580-92d4-11eb-9d36-bbd09fab54d8.png)

* Init the database and populate it with dummy data by running `node sequelize/rest_db.js` inside the server dir
* Start the node server by running `node index.js` inside the server dir
* In another cmd/bash, start the React app by running `npm start` inside the client dir
* Navigate to the corresponding local host url that the React app is running on
* See instructions below to set up and play the game. Note that they are for the deployed app and in the local version, you should use the extension that you cloned from the repository to play the game (found in `src/AdHunter`). 
Additionally the game can only be played in Google Chrome since the extension will not work on other browsers.

Instructions on playing the deployed app: 

1. First open up google chrome and create a new browsing account by clicking on your user icon on the top right of the browser, then under other people, click on Add. 
Type in any username and click the Add button (screenshots below). 

![1 1  Crome User Icon - Edited](https://user-images.githubusercontent.com/25393883/113615494-daa6a500-964b-11eb-91ab-3c81e82c0ffa.png)

![1 2  Chrome Users Popup - Edited](https://user-images.githubusercontent.com/25393883/113615497-db3f3b80-964b-11eb-9937-14a3fa6f77a1.png)

![1 3  Chrome Add User - Edited](https://user-images.githubusercontent.com/25393883/113615499-db3f3b80-964b-11eb-80da-f1515f11c81f.png)

2. A new browser should open with a fresh browser account. Now we need to install the extension in order to be able to play the game. If building the app locally, use the AdHunter folder found in this directory. 
If playing the deployed app you need to download and extract the extension found in this link: [Extension (rar)](https://drive.google.com/file/d/173aHzEQbDKTW15MBAUbU6mp29WOxByJi/view?usp=sharing)

3. Now we need to install the extension. In your new browser, go to options, more tools and then extensions (screenshot below).  

![3 1  Extension Option - Edited](https://user-images.githubusercontent.com/25393883/113615501-dbd7d200-964b-11eb-8a5a-03149c2cf28b.png)

4. You should now see the extensions page of Chrome. Enable developer mode by clicking the corresponding button on the top right of this page.

![3 2  Developer Mode - Edited](https://user-images.githubusercontent.com/25393883/113615502-dbd7d200-964b-11eb-8a9b-3fca36e202d4.png)

5. Now drag and drop the extension folder into the page and you should now see the extension. Note that the folder you should drag the folder named `AdHunter`
and that sometimes you might need to refresh the page before it lets you drag and drop the extension.

![3 3  Drag and Drop](https://user-images.githubusercontent.com/25393883/113615505-dbd7d200-964b-11eb-8a35-e3938f8c2b74.PNG)

6. We can pin the extension to the task bar so that it is easier to view the game stats while playing. To do this click on the extension icon on the top right and pin the Ad Hunter extension.

![3 4  Pin Extension - Edited](https://user-images.githubusercontent.com/25393883/113615507-dc706880-964b-11eb-9ce8-46b19ce48bc7.png)

7. The extension is now installed. In the new browser, visit [Ad-Hunter](https://ad-hunter.herokuapp.com/) to create an account (if building the app locally you should visit the localhost url where the React app is running). When the account is created, ensure that you update the extension by adding in your username as seen in the screenshot below.

![4 1  Extension user name - Edited](https://user-images.githubusercontent.com/25393883/113615492-da0e0e80-964b-11eb-850d-9e90e2062025.png)

You can now play the game! When you finish playing you can remove the extension and disable developer mode. You can also remove the new browser account by going to the settings under the same interface you added the new account from.



