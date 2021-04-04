This directory contains the Chrome Extension's source files. For instructions on how to set up the extension and play the game, see [instructions](https://docs.google.com/document/d/1zIbCuwDIHwgJgykpyYQw8kPiVyl4iTkQkJvB8PoyrjY/edit?usp=sharing).

## Directories:

* **images**: Contains the images that the extension uses.
* **resources**: Contains external scripts and css files that the extension uses.

## Files:

* **manifest.json**: The configuration file of the extension.
* **background.js**: A background script responsible for setting up the extension's storage on installation as well as listening to events to handle updates for the category game mode.
* **blocked.txt**: The list of tracker domains used by the extension.
* **blocked.js**: The parsed list of tracker domains stored in a variable.
* **parserdomains.py**: Parses the tracker list to create blocked.js
* **poputp.html**: The html of the extension's interface.
* **popup.js**: The script that handles updates to the interface.
* **race_mode.js**: The script that handles the logic of the Race mode.
* **socket.io.js**: External script to import socket.io functionality.
* **category_mode.js**: The script that handles the logic of the Category mode.
* **helpers.js**: Contains helper functions that the other script use.
* **identify_tab_id.js**: This script is used during the Category mode to identify on which tab an advert was found.
* **websocket.js**: Configuration of the web socket event listeners/emmiters. 
