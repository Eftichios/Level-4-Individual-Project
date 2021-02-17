import React from 'react';
import "../../index.css";
import "./lobby.css";
import profile from "../../Media/profile.jpeg";
import running from "../../Media/running.png";
import technology from "../../Media/technology.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { LobbyChat } from './LobbyChat';
import socket from "../Utilities/socketConfig";
import { Prompt, Redirect } from 'react-router-dom';
import {toast} from 'react-toastify';
import logger from "../Utilities/logger";

export class Lobby extends React.Component {

    constructor(props){
        super(props);

        this.status_msg_data = {
            "ready": ["Waiting for players to get ready...", "All players ready. You can wait for more players or start the game!", "All players ready. You can start the game!"],
            "game": ["Game has started. Visit websites to find ad trackers!", "Game has started. Try to find an advert on the specified category"],
            "done": ["Game has ended. Winner: "]

        }
        this.state = {
            socket: null,
            lobbyData: this.props.location.state? this.props.location.state.lobby: null,
            temp_winner: null,
            msgData: [],
            msgs: null,
            listeners: ["$userJoinedRoom","$userLeft","$gameFinished","$chatMessage", "$allReady", "$gameStarted", "$ext_error"],
            user_refreshed: false,
            user_left: false,
            status_msg: this.status_msg_data["ready"][0],
            ready: false,
            startDisabled: true,
            game_on: false,
            game_finished: false,
            game_state: null,
            player_metrics: null,
            timer: 0,
            error: null
        }   
        
        this.timerID = null;
    } 

    checkForRefresh(){
        if (localStorage.hasRefreshed){
            if (localStorage.hasRefreshed === "true"){
                localStorage.removeItem("hasRefreshed");
                this.setState({user_refreshed: true})
            }
        }else{
            localStorage.setItem("hasRefreshed", "false")
        }
    }

    leavingPage = async ()=>{
        await socket.emit("userLeftLobby", this.props.location.state.user_id);
        window.removeEventListener('unload', this.leavingPage);
        localStorage.setItem("hasRefreshed", "true")
    }

    onUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
        
    }

    startGame = async () => {
        logger.log("info", `User started game in lobby ${this.state.lobbyData.room}`, this.props.location.state.user_name)
        try {

            const response = await fetch(`/api/startGame`, {
                method:"POST",
                headers: {token: localStorage.token, "Content-Type": "application/json"},
                body: JSON.stringify({"room":this.state.lobbyData.room})
            });
    
            const parseRes = await response.json();
            
            if (parseRes.success){
                this.setState({status_msg: this.state.lobbyData.game_mode==="Race"?this.status_msg_data["game"][0]:this.status_msg_data["game"][1], game_on: true})
            }

        } catch (err){
            toast.error("Failed to start game.");
        } 
    }

    advance_timer(){
        this.setState({timer: this.state.timer+1})
    }

    constructTime(){
        return new Date(this.state.timer * 1000).toISOString().substr(11, 8)
    }

    update_status_msg = (lobby)=>{
        var all_ready = true
        Object.entries(lobby.playerIds).forEach(([key,value])=>{
            if (!value["ready"]){
                all_ready = false
            }
        })
        if (all_ready){
            this.setState({status_msg: Object.keys(this.state.lobbyData.playerIds).length < this.state.lobbyData.MAX_players?this.status_msg_data["ready"][1]:this.status_msg_data["ready"][2], startDisabled: false})
        }else{
            this.setState({status_msg: this.status_msg_data["ready"][0]})
        }
    }

    componentDidMount(){
        
        // check if we are here from a page refresh
        // if so, kick the player out of the lobby
        this.checkForRefresh();

        if (this.props.location.state){

            // detect when user closes the tab/browser
            window.addEventListener('beforeunload', this.onUnload);
            window.addEventListener('unload', this.leavingPage);

            socket.on("userJoinedRoom", (data)=>{
                this.setState({lobbyData: data});
                this.update_status_msg(data);
            }
            );
            socket.on("userLeft", (data)=>{
                this.setState({lobbyData: data});
                this.update_status_msg(data);
            }
            );
            socket.on("gameFinished", (post_game_data)=>{
                clearInterval(this.timerID);
                this.setState({temp_winner: post_game_data.summary.player, 
                    status_msg: this.status_msg_data["done"] + post_game_data.summary.player, 
                    game_on: false, game_state: post_game_data.summary.game_state, 
                    game_finished: true,
                    player_metrics: post_game_data.player_metrics});
            })
            socket.on("chatMessage", (data)=>{
                var tempData = this.state.msgData.concat(data);
                this.setState({msgData: tempData});
                var msgData = tempData.map((msg, index)=><p className={msg.user_name==="lobby"?"text-italic":""} key={index}><small>[{new Date(msg.date).toLocaleTimeString()}] </small>{msg.message} - <strong className={msg.user_name==="lobby"?"text-info":""}>{msg.user_name}</strong> </p>)
                this.setState({msgs: msgData})
            })
            socket.on("allReady", (lobby_update)=>{
                this.setState({startDisabled: !lobby_update.are_all_ready,lobbyData: lobby_update.new_lobby})
                if (lobby_update.are_all_ready){
                    this.setState({status_msg: Object.keys(this.state.lobbyData.playerIds).length < this.state.lobbyData.MAX_players?this.status_msg_data["ready"][1]:this.status_msg_data["ready"][2]})
                }
            })

            socket.on("gameStarted", (data)=>{
                this.setState({status_msg: this.state.lobbyData.game_mode==="Race"?this.status_msg_data["game"][0]:this.status_msg_data["game"][1], game_on: true});
                this.timerID = setInterval(()=>this.advance_timer(), 1000)
                
            })

            socket.on("ext_error", (player)=>{
                if (player===this.props.location.state.user_name){
                    toast.error("You were kicked out of the lobby due to an error while playing.")
                    this.setState({"error": true});
                }
            })
        }

    }

    clear_socket_listeners = (socket) =>{
        for (var i in this.state.listeners){
            if (socket._callbacks.hasOwnProperty(this.state.listeners[i])){
                delete socket._callbacks[this.state.listeners[i]]
            }
        }
    }

    componentWillUnmount(){  
        clearInterval(this.timerID);   
        if (this.state.game_finished){
            window.removeEventListener('beforeunload', this.onUnload);
            this.clear_socket_listeners(socket);
            return
        } 
        if (this.props.location.state){

            socket.emit("userLeftLobby", this.props.location.state.user_id);
            
            // when this component is unmounted remove all listeners from socket
            this.clear_socket_listeners(socket)

            window.removeEventListener('beforeunload', this.onUnload);
        } else {
            toast.error("Redirected to dashboard. To reach the lobby search for a game.");
        }
    }

    constructPlayerTable(){
        return Object.keys(this.state.lobbyData.playerIds).map((id)=><tr key={id}>
                <td><img className="player-small" src={profile} alt="Player" /></td>
                <td><strong>{this.state.lobbyData.playerIds[id]["name"]}</strong></td>
                <td><FontAwesomeIcon className={this.state.lobbyData.playerIds[id]["ready"]?"text-success":"text-danger"} icon={faCircle} /></td>
            </tr>)
    }

    getNumberOfPlayersInLobby(){
        return `${Object.keys(this.state.lobbyData.playerIds).length}/${this.state.lobbyData.MAX_players}`;
    }

    toggleReady(){
        this.setState({ready: !this.state.ready}, ()=>{
            socket.emit("playerToggledReady", {user_id: this.props.location.state.user_id, is_ready: this.state.ready});
        })
        
    }

    leaveLobby(){
        if (window.confirm("Are you sure you want to leave?")){
            this.setState({user_left: true})
        }
        
    }

    render(){
        if (!this.state.lobbyData || this.state.user_refreshed || this.state.user_left){
            return <Redirect to="/dashboard"></Redirect>
        }
        if (this.state.game_finished){
            return <Redirect to={{pathname: "/summary", state: {lobby: this.state.lobbyData, 
                user_name: this.props.location.state.user_name, user_id: this.props.location.state.user_id, 
                winner: this.state.temp_winner, msg_data: this.state.msgData, game_state: this.state.game_state,
                player_metrics: this.state.player_metrics}}}></Redirect>
        }
        if (this.state.error){
            return <Redirect to="/dashboard"></Redirect>
        }

        return <div className="lobby-padding">
            <h3 className="text-center push-down">Lobby - {this.state.lobbyData.room} ({this.state.lobbyData.game_mode})</h3>
            <div className="row">
                <div className="col-md-4">
                    <img className="running" src={this.state.lobbyData.game_mode==="Race"?running:technology} alt="Man running"></img>
                </div>
                <div className="text-center col-md-4">
                <h5><strong>PLAYERS ({this.getNumberOfPlayersInLobby()})</strong></h5>
                <div className="table-wrapper-scroll-y scrollbar">
                    <table className="player-table table table-borderless">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Ready</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.constructPlayerTable()}
                            </tbody>
                    </table>
                </div>
            </div>
            
                <div className="col-md-4">
                    <div className="float-right pr-5 d-flex flex-column align-items-center">
                        <div className="p-1"><img className="lobby-profile" src={profile} alt="Profile" /></div>
                        <div className="p-1 mb-1"><h5><strong>{this.props.location.state.user_name}</strong></h5></div>
                        <div className="mb-1 d-flex flex-column align-items-center game-details">
                            <div className="p-1">Game Mode:</div>
                            <div className="p-1 text-orange">{this.state.lobbyData.game_mode}</div>
                            <div className="p-1">{this.state.lobbyData.game_mode==="Race"?"Get tracked by:":"Category:"}</div>
                            <div className="p-1 text-orange">{this.state.lobbyData.game_mode==="Race"?`${this.state.lobbyData.condition} Unique Ad Trackers`:`${this.state.lobbyData.condition}`}</div>
                        </div>
                        <div className="p-1"><button onClick={()=>this.toggleReady()} className="constSize btn btn-primary">Ready</button></div>
                        <div className="p-1"><button onClick={()=>this.leaveLobby()}className="constSize btn orange">Leave</button></div>
                    </div>
                </div>
            </div>
            <div className="row d-flex flex-column align-items-center">
                <LobbyChat room={this.state.lobbyData.room} msgs={this.state.msgs} user_name={this.props.location.state.user_name}></LobbyChat>
            </div>
            <div className="text-center mb-1 mt-1">
                <strong>{this.state.status_msg} {this.state.game_on?this.constructTime():""}</strong>
            </div>
            <div className="text-center">
                <button disabled={this.state.startDisabled || this.state.game_on} onClick={()=>this.startGame()} className="btn btn-primary constSize">{this.state.game_on?"Game in progress":"Start Game"}</button>
            </div>
            <Prompt when={true} message={(location, action)=>{
                
                return location.pathname==="/lobby"?true:"Are you sure you want to leave?";
            }}></Prompt>
        </div>
    }
}

export default Lobby;