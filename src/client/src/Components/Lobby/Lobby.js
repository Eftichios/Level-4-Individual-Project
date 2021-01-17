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

        this.state = {
            socket: null,
            lobbyData: this.props.location.state? this.props.location.state.lobby: null,
            temp_winner: null,
            msgData: [],
            msgs: null,
            listeners: ["$userJoinedRoom","$userLeft","$gameFinished","$chatMessage"],
            user_refreshed: false,
            status_msg: "Waiting for players to get ready...",
            ready: false,
            startDisabled: true
        }   
             
              
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
        logger.log("info", `User started game in lobby ${this.state.lobbyData.room}`, this.props.location.user_name)
        try {

            const response = await fetch(`http://localhost:5000/api/startGame`, {
                method:"POST",
                headers: {token: localStorage.token, "Content-Type": "application/json"},
                body: JSON.stringify({"room":this.state.lobbyData.room})
            });
    
            const parseRes = await response.json();
            
            if (parseRes.success){
                this.setState({status_msg: this.state.lobbyData.game_mode==="Race"?"Game has started. Visit websites to find ad trackers!":
                                                                                    `Game has started. Try to find an advert on "Technology"`})
            }

        } catch (err){
            toast.error("Failed to start game.");
        } 
    }

    componentDidMount(){
        
        // check if we are here from a page refresh
        // if so, kick the player out of the lobby
        this.checkForRefresh()

        if (this.props.location.state){

            // detect when user closes the tab/browser
            window.addEventListener('beforeunload', this.onUnload);
            window.addEventListener('unload', this.leavingPage);

            socket.on("userJoinedRoom", (data)=>{
                this.setState({lobbyData: data});
                }
            );
            socket.on("userLeft", (data)=>{
                this.setState({lobbyData: data});
                }
            );
            socket.on("gameFinished", (data)=>{
                this.setState({temp_winner: data.player});
            })
            socket.on("chatMessage", (data)=>{
                var tempData = this.state.msgData.concat(data);
                this.setState({msgData: tempData});
                var msgData = tempData.map((msg, index)=><p className={msg.user_name==="lobby"?"text-italic":""} key={index}><small>[{new Date(msg.date).toLocaleTimeString()}] </small>{msg.message} - <strong className={msg.user_name==="lobby"?"text-info":""}>{msg.user_name}</strong> </p>)
                this.setState({msgs: msgData})
            })
            socket.on("allReady", (lobby_update)=>{
                this.setState({startDisabled: !lobby_update.are_all_ready,lobbyData: lobby_update.new_lobby})
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

    render(){
        if (!this.state.lobbyData || this.state.user_refreshed){
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
                        <div className="p-1 mb-4"><h3><strong>{this.props.location.state.user_name}</strong></h3></div>
                        <div className="mb-4 d-flex flex-column align-items-center game-details">
                            <div className="p-1">Game Mode:</div>
                            <div className="p-1 text-orange">{this.state.lobbyData.game_mode}</div>
                            <div className="p-1">{this.state.lobbyData.game_mode==="Race"?"Get tracked by:":"Category"}</div>
                            <div className="p-1 text-orange">{this.state.lobbyData.game_mode==="Race"?`100 Ad Trackers`:`Technology`}</div>
                        </div>
                        <div className="p-1 mb-2"><button onClick={()=>this.toggleReady()} className="constSize btn btn-primary">Ready</button></div>
                        <div className="p-1"><button className="constSize btn orange">Leave</button></div>
                    </div>
                </div>
            </div>
            <div className="row d-flex flex-column align-items-center">
                <LobbyChat room={this.state.lobbyData.room} msgs={this.state.msgs} user_name={this.props.location.state.user_name}></LobbyChat>
            </div>
            <div className="text-center mb-4 mt-2">
                <strong>{this.state.status_msg}</strong>
            </div>
            <div className="text-center">
                <button disabled={this.state.startDisabled} onClick={()=>this.startGame()} className="btn btn-primary constSize">Start Game</button>
            </div>
            <Prompt when={true} message={(location, action)=>{
                console.log(location, action);
                
                return location.pathname==="/lobby"?true:"Are you sure you want to leave?";
            }}></Prompt>
        </div>
    }
}

export default Lobby;