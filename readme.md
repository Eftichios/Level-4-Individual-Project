## A distributed game using adverts in Web Browsers.

This is my Level 4 individual project. It involves tracking the adverts delivered to the web browser of a number of players, 
and creating a game in which players compete to be advertised with some product or category of product.
This means that players will be given a fresh web browser account and some product or category of product (players could possibly
select the product themselves), then the players would browse the web with the purpose of seeing that product as an advert.
The first player to get an advert of that product wins.

This game should allow communication between players and also have data on challenges, achievements and leaderboards.

It will be implemented as a web application using the PERN (Postgresql, Express, React, Node) stack. 


From the proposal and discussions with my supervisor the initial idea was to use Facebook as a playing ground.
More precisly, players would be given a fresh Facebook account (to ensure anonimity and privacy of personal data),
then they would browse Facebook, liking pages and setting their interests in order to get targeted with a specific ad.
We would have a system in place that identified those ads by either looking at network requests or the DOM content of a web page.

However, as the project progresses there are a lot of technical (or other) problems with using Facebook:
* I have created a new account in order to explore what kind of ads this account would get targeted, unfortunately after a few weeks with no success I reached the conclusion that Facebook must have flagged the account and therefore it is not getting profiled and it is receiving no adverts.
* In light of this, I have created two more accounts to try and understand what exactly went wrong. Both of these accounts were banned instantly (did not even reach the home page of Facebook).
* Furthermore, sharing accounts between multiple users or using "inauthentic" accounts vilotes Facebook's community guidelines.
* Therefore using fake accounts for the game is simply not possible.

More generally:
* Even if we are able to pull adverts from a web page, how can we categorise them? Since ads generally have no descriptive text. (Image classifiers?)
* How can we monitor user browser activity through our web app? We would need some kind of web proxy running on the user's machine which we have no control over. (Chrome Extension?)

Hence this has shifted the focus of the project from looking at adverts to looking at ad trackers.

How can we determine ad trackers?* When visiting a web page with ad trackers, it makes Http requests to various different ad servers.
* The ad servers are typically known and are kept in a list (such as that used for ad blocking).
* We can then compare the requests with this list and determine which requests are for ad tracking.
* The idea is to use the data of the ad trackers, such as location and name to build a fun and engaging game.

Remaining challenges:
* How can we get the network traffic of a person that is simply using our website? This is not possible without using something external.
    * The idea for now is to try using a chrome extension. Of course this would limit the platforms that this game can be played on (assuming that we can actually build and release an extension that monitors web traffic).

In case all else fails, the backup plan is to use everything we have learned about ad targeting and profiling and try to simulate an advert delivery system:
* Create a mock-up of Facebook, giving players the same controls (Page likes, interests, posts, comments).
* Use these controls to deliver ads to players.
* Need to have a huge collection of ads with corresponding tag labels.


