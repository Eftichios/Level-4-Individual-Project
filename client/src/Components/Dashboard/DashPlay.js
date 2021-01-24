import React from 'react';
import "../../index.css";
import "./dashboard.css";
import profile from "../../Media/profile.jpeg";
import DashLead from './DashLead';
import {Redirect} from 'react-router';
import socket from "../Utilities/socketConfig";
import {toast} from 'react-toastify';
import logger from '../Utilities/logger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export class DashPlay extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            rank: 0,
            lobby: null,
            game_mode: "Race",
            finding_game: false
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

    componentDidMount(){
        if (this.props.from_summary){
            this.setState({game_mode: this.props.from_summary})
            this.findGame(this.props.user_id, this.props.name)
        }
    }

    getUserRank = async (user_name) =>{
        // in the future use props.score to calculate ranks
        this.state.rank = 5
    }

    findGame = async (user_id, user_name) => {
        logger.log("info","User searching for game", user_name)
        try {
            this.setState({finding_game: true})
            const response = await fetch("/api/play", {
                method: "POST",
                headers: {token: localStorage.token, "Content-Type": "application/json"},
                body: JSON.stringify({ "user_id": user_id, "user_name": user_name, "socketId": socket.id, "game_mode": this.state.game_mode }),
            });

            const parseRes = await response.json();
            
            if (parseRes.success) {
                this.setState({lobby: parseRes.lobby});
            }else {
                toast.error(parseRes); 
                this.setState({finding_game: false})
            }
        } catch (err) {
            toast.error(err.message);      
            this.setState({finding_game: false})
        }     
    }

    setGameMode = ()=>{
        
        if (this.state.game_mode === "Race"){
            this.setState({game_mode: "Category"})
        } else {
            this.setState({game_mode: "Race"})
        }
        logger.log("info",`User switched game mode for ${this.state.game_mode}`, this.props.name)
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
                    <button onClick={()=>this.findGame(this.props.user_id, this.props.name)} className="constSize btn btn-primary">{this.state.finding_game?"Searching for game...":"Find Game"}</button>
                </div>
                <div className="p-1"><DashLead user="George"></DashLead></div>
                <div className="p-1"><button onClick={this.setGameMode} className="constSize btn btn-secondary" >
                <FontAwesomeIcon className="mr-1" icon={faChevronLeft} /><small>Game Mode:</small> {this.state.game_mode}<FontAwesomeIcon className="ml-1" icon={faChevronRight} />
                    </button></div>
               </div>
    }

}

export default DashPlay;