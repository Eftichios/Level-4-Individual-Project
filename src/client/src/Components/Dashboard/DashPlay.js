import React from 'react';
import "../../index.css";
import "./dashboard.css";
import profile from "../../Media/profile.jpeg";
import DashLead from './DashLead';
import {Redirect} from 'react-router';
import socket from "../Utilities/socketConfig";

export class DashPlay extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            rank: 0,
            lobby: null,
        };

        socket.on('connect', ()=>{
            console.log('Connected to server')
        });

        socket.on('clientGameOver', (data)=>{
            this.setState({status: "Not in game", showStopButton: false});
            this.setState({game_state: data});
        })

        this.getUserRank(props.name)
    }

    getUserRank = async (user_name) =>{
        // in the future use props.score to calculate ranks
        this.state.rank = 5
    }

    findGame = async (user_name) => {
        try {
            const response = await fetch("http://localhost:5000/api/play", {
                method: "POST",
                headers: {token: localStorage.token, "Content-Type": "application/json"},
                body: JSON.stringify({ "user_name": user_name, "socketId": socket.id }),
            });

            const parseRes = await response.json();
            // console.log(parseRes);
            if (parseRes) {
                console.log(parseRes);
                this.setState({lobby: parseRes});
            }

        } catch (err) {
            console.error(err.message);
        }
        
    }

    render(){
        if (this.state.lobby){
            return <Redirect to={{pathname: "/lobby", state: {lobby: this.state.lobby}}}  />
        }
        return <div className="d-flex flex-column align-items-center">
                <div className="p-1"><img className="profile" src={profile} alt="Profile" /></div>
                <div className="p-1">Player: {this.props.name}</div>
                <div className="p-1">Rank: {this.state.rank}</div>
                <div className="p-1">
                    <button onClick={()=>this.findGame(this.props.name)} className="constSize btn btn-primary">Play Game</button>
                </div>
                <div className="p-1"><DashLead user="George"></DashLead></div>
                <div className="p-1"><button className="constSize btn btn-secondary" >Game Mode</button></div>
               </div>
    }

}

export default DashPlay;