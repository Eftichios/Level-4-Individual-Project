import React from 'react';
import "../../index.css";
import "./lobby.css";
import profile from "../../Media/profile.jpeg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { LobbyChat } from './LobbyChat';

export class Lobby extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return <div>
            <h3 className="text-center mb-4">Lobby</h3>
            <div className="row">
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-md-5 card">
                            <div className="card-body">VOTE</div>
                        </div>
                        <div className="col-md-7 text-center card">
                            <div className="card-body">
                                <span>PLAYERS</span>
                                <table class="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Ready</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><img className="player-small" src={profile} alt="Player" /></td>
                                            <td ><strong>George</strong></td>
                                            <td><FontAwesomeIcon className="text-danger" icon={faCircle} /></td>
                                        </tr>
                                        <tr>
                                            <td><img className="player-small" src={profile} alt="Player" /></td>
                                            <td>Jacob</td>
                                            <td><FontAwesomeIcon className="text-success" icon={faCircle} /></td>
                                        </tr>
                                        <tr>
                                            <td><img className="player-small" src={profile} alt="Player" /></td>
                                            <td>Larry</td>
                                            <td><FontAwesomeIcon className="text-success" icon={faCircle} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="d-flex flex-column align-items-center">
                        <div className="p-1"><img className="profile" src={profile} alt="Profile" /></div>
                        <div className="p-1"><button className="constSize btn btn-primary">Ready</button></div>
                        <div className="p-1"><button className="constSize btn orange">Leave</button></div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <LobbyChat user="George"></LobbyChat>
            </div>
            <div className="text-center mb-4 mt-2">
                <strong>Wating for players to get ready...</strong>
            </div>
            <div class="text-center">
                <button disabled="true" className="btn btn-primary constSize">Start Game</button>
            </div>
        </div>
    }
}

export default Lobby;