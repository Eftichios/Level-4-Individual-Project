import React from 'react';
import "../../index.css";
import "./summary.css";
import profile from "../../Media/profile.jpeg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { LobbyChat } from '../Lobby/LobbyChat';

export class Summary extends React.Component {

    constructor(props){
        super(props);

        class Messages {
            
            constructor(id, player, msg, date ){
                this.id = id;
                this.player = player;
                this.msg = msg;
                this.date = date;
            }
        }

        this.msgs_data = [new Messages(1, "George","That was fun!", new Date()), 
                    new Messages(2, "Jacob","Yeah, wanna play again?", new Date()), 
                    new Messages(3, "Larry","I have to go, maybe later.", new Date()), 
                    new Messages(4, "George","Im up to play again", new Date()), 
                    new Messages(5, "Jacob","See ya, have fun boys!", new Date())]
        
        this.msgs = this.msgs_data.map((msg)=><p key={msg.id}><small>{msg.date.toLocaleTimeString()} </small>{msg.msg} - <strong>{msg.player}</strong> </p>)
    }

    render(){
        return <div className="summary-padding">
            <h3 className="text-center push-down">Summary</h3>
            <div className="row">
                <div className="text-center col-md-4">
                    <h3><strong>George</strong> is the winner!</h3>
                    <h5><strong>Score:</strong></h5>
                    <div className="stats-table">
                        <table className="table table-borderless">
                            <thead>
                                <th scope="col"></th>
                                <th scope="col">Player</th>
                                <th scope="col">Trackers Found</th>
                            </thead>
                            <tbody>
                            <tr>
                                <td>1st</td>
                                <td>George</td>
                                <td>100</td>
                            </tr>
                            <tr>
                                <td>2nd</td>
                                <td>Jacob</td>
                                <td>91</td>
                            </tr>
                            <tr>
                                <td>3rd</td>
                                <td>Larry</td>
                                <td>78</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center col-md-4">
                <h5><strong>Page History</strong></h5>
                <div className="table-wrapper-scroll-y scrollbar">
                    <table className="player-table table table-borderless">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                                <th scope="col">Url</th>
                                <th scope="col">Tracker Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Google</td>
                            <td><FontAwesomeIcon className="text-info" icon={faInfoCircle} /></td>
                            <td>3</td>
                        </tr>
                        <tr>
                            <td>news-site.com</td>
                            <td><FontAwesomeIcon className="text-info"  icon={faInfoCircle} /></td>
                            <td>21</td>
                        </tr>
                        <tr>
                            <td>technology.com</td>
                            <td><FontAwesomeIcon className="text-info"  icon={faInfoCircle} /></td>
                            <td>14</td>
                        </tr>
                        <tr>
                            <td>Travel blog</td>
                            <td><FontAwesomeIcon className="text-info"  icon={faInfoCircle} /></td>
                            <td>62</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
            
                <div className="col-md-4">
                    <div className="float-right pr-5 d-flex flex-column align-items-center">
                        <div className="p-1"><img className="lobby-profile" src={profile} alt="Profile" /></div>
                        <div className="p-1 mb-4"><h3><strong>George</strong></h3></div>
                        <div className="mb-4 d-flex flex-column align-items-center game-details">
                            <div className="p-1">Game Mode:</div>
                            <div className="p-1 text-orange">Race</div>
                            <div className="p-1">Get tracked by:</div>
                            <div className="p-1 text-orange">100 Ad Trackers</div>
                        </div>
                        <div className="p-1"><button className="constSize btn orange">Play Again</button></div>
                    </div>
                </div>
            </div>
            <div className="row d-flex flex-column align-items-center">
                <LobbyChat msgs={this.msgs} user="George"></LobbyChat>
            </div>
            <div className="text-center mb-4 mt-2">
                <strong>Game is over. Click on Done to return to the Dashboard.</strong>
            </div>
            <div className="text-center">
                <button className="btn btn-primary constSize">Done</button>
            </div>
        </div>
    }
}

export default Summary;