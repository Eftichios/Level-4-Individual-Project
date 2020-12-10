import React from 'react';
import "../../index.css";
import "./dashboard.css";
import profile from "../../Media/profile.jpeg";
import DashLead from './DashLead';
import { parse } from '@fortawesome/fontawesome-svg-core';
import { faBoxTissue } from '@fortawesome/free-solid-svg-icons';

export class DashPlay extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            rank: 0,
            status: "Not in game",
            statusClass: {"Not in game":"text-danger", "In game":"text-success"},
            showStopButton: false
        };

        this.getUserRank(props.name)
    }

    getUserRank = async (user_name) =>{
        // in the future use props.score to calculate ranks
        this.state.rank = 5
    }

    startGame = async (user_name) => {
        try {
            const response = await fetch("http://localhost:5000/api/play", {
                method: "POST",
                headers: {token: localStorage.token, "Content-Type": "application/json"},
                body: JSON.stringify({ "user_name": user_name }),
            });

            const parseRes = await response.json();

            if (parseRes) {
                this.setState({status: "In game", showStopButton: true});
            }

        } catch (err) {
            console.error(err.message);
        }
        
    }

    stopGame = async (user_name) => {
        try {
            const response = await fetch("http://localhost:5000/api/stopGame", {
                method: "POST",
                headers: {token: localStorage.token, "Content-Type": "application/json"},
                body: JSON.stringify({ "user_name": user_name }),
            })

            const parseRes = await response.json();

            if (parseRes){
                this.setState({status: "Not in game", showStopButton: false});
            }

        } catch (err ) {
            console.error(err.message);
        }

    }

    render(){
        return <div className="d-flex flex-column align-items-center">
                <div className="p-1"><img className="profile" src={profile} alt="Profile" /></div>
                <div className="p-1">Player: {this.props.name}</div>
                <div className="p-1">Rank: {this.state.rank}</div>
                <div className={`p-1 ${this.state.statusClass[this.state.status][0]}`}>Status: {this.state.status}</div>
                <div className="p-1">
                    <button hidden={this.state.showStopButton} onClick={()=>this.startGame(this.props.name)} className="constSize btn btn-primary">Play Game</button>
                    <button hidden={!this.state.showStopButton} onClick={()=>this.stopGame(this.props.name)} className="constSize btn btn-danger">Stop Game</button>
                </div>
                <div className="p-1"><DashLead user="George"></DashLead></div>
                <div className="p-1"><button className="constSize btn btn-secondary" >Game Mode</button></div>
               </div>
    }

}

export default DashPlay;