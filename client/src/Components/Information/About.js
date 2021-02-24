import React, { Fragment } from "react";
import "./about.css";
import "../../index.css";

export class About extends React.Component {

    render(){
        return <Fragment> 
        <div className="info-section">
            <div className="info-title">
                <h3>Ad Trackers and advertisers:</h3>
            </div>
            <div className="info-text">
            <p>Ad Trackers are the entities that track the users when they are browsing the web, usually by embedding content 
               in the website such as invisible pixels or by using cookies. They gather information about the user and share it
               with advertisers. The advertisers then use that information to profile the user in order to target them with personalised adverts that they assume the
               user would be more interested in.
            </p>
            </div>
            <div className="info-title">
                <h3>Motivation of the game:</h3>
            </div>
            <div className="info-text">
                <p>For this project, we use ad trackers and adverts to build a game with the purpose of improving transparency on targeted advertising as well as exploring the 
                    knowledge that users already have. 
                </p>
                <p><strong>The Race Mode:</strong> In this game mode, the players can see in real time how many trackers are on a website (along with their domains). Observing this, the players 
                can determine what kind of websites include the most tracking, and therefore which websites to avoid if they are concerned about privacy.</p>
                <p><strong>The Category Mode:</strong> In this game mode, players will explore the way the interest profile is build when browsing the web. They will also 
                observe and understand what advert categories are most common and why.</p>
            </div>
            <div className="info-title">
                <h3>The Chrome Extension:</h3>
            </div>
            <div className="info-text">
            <p >During the game-play we need something that can look at the network requests and the DOM of each player and identify ad trackers/adverts. To do this we use a Chrome
                extension which communicates with our server to update the game states accordingly. You must have the extension installed to play the game, 
                information on how to set up the extension and play the game can be found here: <a href="https://docs.google.com/document/d/1zIbCuwDIHwgJgykpyYQw8kPiVyl4iTkQkJvB8PoyrjY/edit?usp=sharing">Instructions to set up</a>.
            </p>
            </div>
            <div className="info-title">
                <h3>What information is gathered:</h3>
            </div>
            <div className="info-text">
            <div>During the game-play we gather and store useful information that would help us evaluate the player's strategies and behaviour. The information that is gathered is:
                <ul>
                    <li>Websites visited during the game.</li>
                    <li>Trackers found in each website (in the case of the Race mode).</li>
                    <li>Advert images along with their categorisation (in the case of the Category mode).</li>
                    <li>Player names and scores</li>
                </ul>
                Note: No information is gathered when not playing. 
            </div>
            </div>
            <div className="info-title">
                <h3>How it works:</h3>
                
            </div>
            <div className="info-text">
            <p><strong>The Race Mode:</strong> The chrome extension looks at the network requests made from each website the player visits during gameplay. The domain of those requests is extracted and compared
            with a list of known tracker domains. If a request is made to a domain in that list, we know that it is a tracker.</p>
            <p><strong>The Category Mode:</strong> The chrome extension looks at the DOM of each website the player visits during gameplay. It identifies potential elements
            that could be adverts and extracts their redirection url. We then use that url to categorise the content of the landing page into high level categories such as Science or
            Sports.</p>
            </div>
            <div className="info-title">
                <h3>Disclaimer:</h3>
            </div>
            <div className="info-text">
            <p>While the extension manages to identify most trackers, there are still trackers that won't be identified due to the fact that the list of known trackers is not 
                exhaustive. Furthermore, in categorising adverts, not only can adverts not be identified, the extracted categories are not always accurate. This means that sometimes
                during gameplay, you might see an advert on the given category first but still not win if the extension fails to identify that advert. This can cause some frustrations but
                the nature of this game is experimental and education and it should still provide useful insights into what happens behind the scenes when browsing the web.
            </p>
            </div>
        </div>
        </Fragment>
    }
}

export default About;