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

        
        class Messages {
            
            constructor(id, player, msg, date){
                this.id = id;
                this.player = player;
                this.msg = msg;
                this.date = date;
            }
        }

        this.msgs_data = [new Messages(1, "George","Hey everyone!", new Date()), 
                    new Messages(2, "Jacob","Hello!", new Date()), 
                    new Messages(3, "Larry","Yoo, have fun guys!", new Date()), 
                    new Messages(4, "George","Thanks man, you too!", new Date()), 
                    new Messages(5, "Jacob","Good luck :)", new Date())]
        
        this.msgs = this.msgs_data.map((msg)=><p key={msg.id}><small>{msg.date.toLocaleTimeString()} </small>{msg.msg} - <strong>{msg.player}</strong> </p>)
    }
    

    render(){
        return <div>
            <h3 className="text-center mb-4">Lobby</h3>
            <div className="row">
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-md-4 card">
                            <div className="card-body">
                                <h3 className="text-center">Vote</h3>
                                <div className="row">
                                    <div className="col-md-5 pad-img left-imgs">
                                        <img src="https://via.placeholder.com/100" alt="category 1"/>
                                    </div>
                                    <div className="col-md-5 pad-img right-imgs">
                                        <img src="https://via.placeholder.com/100" alt="category 2" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-5 pad-img left-imgs">
                                        <img src="https://via.placeholder.com/100" alt="category 3" />
                                    </div>
                                    <div className="col-md-5 pad-img right-imgs">
                                        <img src="https://via.placeholder.com/100" alt="category 4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-1"></div>
                        <div className="col-md-7 text-center card">
                            <div className="card-body">
                                <span>PLAYERS</span>
                                <div className="table-wrapper-scroll-y scrollbar">
                                <table className="table table-borderless">
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
                <LobbyChat msgs={this.msgs} user="George"></LobbyChat>
            </div>
            <div className="text-center mb-4 mt-2">
                <strong>Wating for players to get ready...</strong>
            </div>
            <div className="text-center">
                <button disabled={true} className="btn btn-primary constSize">Start Game</button>
            </div>
        </div>
    }
}

export default Lobby;