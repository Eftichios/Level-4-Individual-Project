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
            <h3 className="text-center mb-4">Summary</h3>
            <div className="row">
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-md-4 card">
                            <div className="card-body">
                                <h3 className="text-center"><strong>George</strong> is the winner!</h3>
                                    <div className="text-center">
                                        <img src="https://via.placeholder.com/100" alt="winner" />
                                    </div>
                                <p>Game Mode: <strong>Race</strong></p>
                                <p>Time taken: <strong>00:05:37</strong></p>
                            </div>
                        </div>
                        <div className="col-md-1"></div>
                        <div className="col-md-7 text-center card">
                            <div className="card-body">
                                <span>Page History</span>
                                <div className="table-wrapper-scroll-y scrollbar">
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Url</th>
                                            <th scope="col">Ad Count</th>
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
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="d-flex flex-column align-items-center">
                        <div className="p-1"><img className="profile" src={profile} alt="Profile" /></div>
                        <div className="p-1"><button className="constSize btn orange">Play Again</button></div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <LobbyChat msgs = {this.msgs} user="George"></LobbyChat>
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