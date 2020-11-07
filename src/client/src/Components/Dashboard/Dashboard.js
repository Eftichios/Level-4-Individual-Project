import React from 'react';
import "../../index.css"
import "./dashboard.css"
import profile from "../../Media/profile.jpeg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export class Dashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: "George",
            rank: 4
        }
    }

    render(){
        return <div>
            <div className="row">
                <div className="col-md-6">
                    <div className="d-flex flex-column align-items-center">
                        <div className="p-1"><img className="profile" src={profile} alt="Profile" /></div>
                        <div className="p-1">Player: {this.state.name}</div>
                        <div className="p-1">Rank: {this.state.rank}</div>
                        <div className="p-1"><button className="constSize btn btn-primary">Play Game</button></div>
                        <div className="p-1"><button className="constSize btn orange">View Leaderboards</button></div>
                        <div className="p-1"><button className="constSize btn btn-secondary">Game Mode</button></div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex flex-column align-items-center">
                        <div className="p-1"><h3>Settings</h3></div>
                        <div className="p-1"><button className="constSize btn btn-secondary">Change Password</button></div>
                        <div className="p-1"><button className="constSize btn btn-danger">Delete Account</button></div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="d-flex flex-column align-items-center">
                    <h3>Achievements</h3>
                    <table class="table text-center not-full">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Difficulty</th>
                                <th scope="col">Title</th>
                                <th scope="col">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td><FontAwesomeIcon className="text-primary" icon={faInfoCircle} /></td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td><FontAwesomeIcon className="text-primary" icon={faInfoCircle} /></td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td><FontAwesomeIcon className="text-primary" icon={faInfoCircle} /></td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                <div className="col-md-3">
                    <div class="card">
                        <h3>Metrics</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div class="card mr-2">
                        <h3>Game History</h3>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Dashboard;