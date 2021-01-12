import React from 'react';
import "../../index.css";
import "./dashboard.css";
import profile from "../../Media/profile.jpeg";
import DashLead from './DashLead';
import {Redirect} from 'react-router';
import socket from "../Utilities/socketConfig";
import {toast} from 'react-toastify';

export class DashPlay extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            rank: 0,
            lobby: null,
            game_mode: "Race"
        };

        // ensure that the socket listener is added only once
        if (socket._callbacks){
            if (!socket._callbacks.hasOwnProperty("$connect")){
                socket.on('connect', ()=>{
                    console.log('Connected to server')
                });
            }
        } else {
            socket.on('connect', ()=>{
                console.log('Connected to server')
            });
            socket.on('clientGameOver', (data)=>{
                this.setState({status: "Not in game", showStopButton: false});
                this.setState({game_state: data});
            })
        }
        

        this.getUserRank(props.name)
    }

    getUserRank = async (user_name) =>{
        // in the future use props.score to calculate ranks
        this.state.rank = 5
    }

    findGame = async (user_id, user_name) => {
        try {
            const response = await fetch("http://localhost:5000/api/play", {
                method: "POST",
                headers: {token: localStorage.token, "Content-Type": "application/json"},
                body: JSON.stringify({ "user_id": user_id, "user_name": user_name, "socketId": socket.id, "game_mode": this.state.game_mode }),
            });

            const parseRes = await response.json();
            if (parseRes.success) {
                this.setState({lobby: parseRes.lobby});
            } else {
                toast.error(parseRes.error);
            }
        } catch (err) {
            console.error(err.message);      
        }
        
    }

    setGameMode = ()=>{
        if (this.state.game_mode == "Race"){
            this.setState({game_mode: "Category"})
        } else {
            this.setState({game_mode: "Race"})
        }
    }

    render(){
        if (this.state.lobby){
            return <Redirect to={{pathname: "/lobby", state: {lobby: this.state.lobby, user_name: this.props.name, user_id: this.props.user_id}}}  />
        }
        return <div className="d-flex flex-column align-items-center">
                <div className="p-1"><img className="profile" src={profile} alt="Profile" /></div>
                <div className="p-1">Player: {this.props.name}</div>
                <div className="p-1">Rank: {this.state.rank}</div>
                <div className="p-1">
                    <button onClick={()=>this.findGame(this.props.user_id, this.props.name)} className="constSize btn btn-primary">Play Game</button>
                </div>
                <div className="p-1"><DashLead user="George"></DashLead></div>
                <div className="p-1"><button onClick={this.setGameMode} className="constSize btn btn-secondary" >Game Mode: {this.state.game_mode}</button></div>
               </div>
    }

}

export default DashPlay;