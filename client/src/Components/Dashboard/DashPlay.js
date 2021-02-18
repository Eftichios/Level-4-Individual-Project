import React from 'react';
import "../../index.css";
import "./dashboard.css";
import DashLead from './DashLead';
import {Redirect} from 'react-router';
import socket from "../Utilities/socketConfig";
import {toast} from 'react-toastify';
import logger from '../Utilities/logger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faPencilAlt } from '@fortawesome/free-solid-svg-icons'

export class DashPlay extends React.Component {

    constructor(props){
        super(props);

        this.canditate_profiles = ['blue_bot.svg', 'cyan_bot.svg',
        'red_bot.svg', 'green_bot.svg',
        'grey_bot.svg', 'lilah_bot.svg',
        'purple_bot.svg', 'red_bot.svg', 'yellow_bot.svg']

        this.state = {
            lobby: null,
            game_mode: "Race",
            finding_game: false,
            icon_index: this.canditate_profiles.indexOf(props.icon_path),
            temp_index: this.canditate_profiles.indexOf(props.icon_path),
        };

        this.actual_picture = require(`../../Media/bots/${this.canditate_profiles[this.canditate_profiles.indexOf(props.icon_path)]}`).default

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
        }
    }

    componentDidMount(){
        if (this.props.from_summary){
            this.setState({game_mode: this.props.from_summary})
            this.findGame(this.props.user_id, this.props.name)
        }
    }

    findGame = async (user_id, user_name) => {
        logger.log("info","User searching for game", user_name)
        try {
            this.setState({finding_game: true})
            const response = await fetch("/api/play", {
                method: "POST",
                headers: {token: localStorage.token, "Content-Type": "application/json"},
                body: JSON.stringify({ "user_id": user_id, "user_name": user_name, "socketId": socket.id, "game_mode": this.state.game_mode, "profile": this.props.icon_path }),
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

    async switchIcon(){
        this.setState({temp_index: (this.state.temp_index + 1) % this.canditate_profiles.length});
    }

    getPicture(index){
        let temp = require(`../../Media/bots/${this.canditate_profiles[index]}`).default
        this.actual_picture = temp
        return temp
    }

    async updateProfile(changed){
        if (changed){
            await this.setState({icon_index: this.state.temp_index})
            this.props.saveProfile(this.canditate_profiles[this.state.icon_index])
        } else {
            await this.setState({temp_index: this.state.icon_index})
            return
        }
    }

    render(){
        if (this.state.lobby){
            return <Redirect to={{pathname: "/lobby", state: {lobby: this.state.lobby, user_name: this.props.name, user_id: this.props.user_id, profile: this.props.icon_path}}}  />
        }
        return  <div>
                <div className="modal fade" id="profile" tabIndex="-1" role="dialog" aria-labelledby="profileLabel" aria-hidden="true">
                <div className="modal-dialog modal-md" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="profileLabel">Change Profile Picture</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body remove-scroll text-center">
                        <div className="row center-pictures">
                            <img className="profile" src={this.getPicture(this.state.temp_index)} alt="Profile" />
                        </div>
                        <button className="row btn btn-primary mt-4 constSize" onClick={()=>this.switchIcon()} >Next</button>
                    </div>
                    <div className="modal-footer">
                        <button onClick={()=>this.updateProfile(true)} type="button" className="btn btn-primary" data-dismiss="modal">Save</button>
                        <button onClick={()=>this.updateProfile(false)} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
                </div>
                <div className="d-flex flex-column align-items-center">
                <div className="p-1">
                    <img className="profile" src={require(`../../Media/bots/${this.canditate_profiles[this.canditate_profiles.indexOf(this.props.icon_path)]}`).default} alt="Profile" />
                    <FontAwesomeIcon data-toggle="modal" data-target="#profile" className="toggle-profile text-primary detail-hover" icon={faPencilAlt} />
                </div> 
                <div className="p-1">Player: {this.props.name}</div>
                <div className="p-1">Rank: {this.props.rank}</div>
                <div className="p-1">
                    <button disabled={!this.props.user_id} onClick={()=>this.findGame(this.props.user_id, this.props.name)} className="constSize btn btn-primary">{this.state.finding_game?"Searching for game...":"Find Game"}</button>
                </div>
                <div className="p-1"><DashLead user="George"></DashLead></div>
                <div className="p-1"><button onClick={this.setGameMode} className="constSize btn btn-secondary" >
                <FontAwesomeIcon className="mr-1" icon={faChevronLeft} /><small>Game Mode:</small> {this.state.game_mode}<FontAwesomeIcon className="ml-1" icon={faChevronRight} />
                    </button></div>
               </div>
               </div>
    }

}

export default DashPlay;