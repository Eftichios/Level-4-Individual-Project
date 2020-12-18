import React from 'react';
import "../../index.css";
import "./lobby.css";
import profile from "../../Media/profile.jpeg";
import running from "../../Media/running.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { LobbyChat } from './LobbyChat';
import socket from "../Utilities/socketConfig";
import { Prompt, Redirect } from 'react-router-dom';

export class Lobby extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            socket: null,
            lobbyData: this.props.location.state? this.props.location.state.lobby: null,
            temp_winner: null,
            msgData: [],
            msgs: null
        }              
    } 

    onUnload = (e) => {
        e.preventDefault();
        e.returnValue = '';
    }

    startGame = async () => {
        try {

            const response = await fetch(`http://localhost:5000/api/startGame`, {
                method:"POST",
                headers: {token: localStorage.token, "Content-Type": "application/json"},
                body: JSON.stringify({"room":this.state.lobbyData.room})
            });
    
            const parseRes = await response.json();

        } catch (err){
            console.error(err.message)
        } 
    }

    componentDidMount(){
        
        if (this.props.location.state){

            // detect when user closes the tab/browser
            window.addEventListener('beforeunload', this.onUnload);

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
        }
    }

    componentWillUnmount(){      
        if (this.props.location.state){
            socket.emit("userLeftLobby", this.props.location.state.user_id);
            window.removeEventListener('beforeunload', this.onUnload);
        } else {
            console.log("Redirecting to dashboard. To reach the lobby search for a game.")
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

    render(){
        if (!this.state.lobbyData){
            return <Redirect to="/dashboard"></Redirect>
        }

        return <div className="lobby-padding">
            <h3 className="text-center push-down">Lobby - {this.state.lobbyData.room}</h3>
            <div className="row">
                <div className="col-md-4">
                    <img className="running" src={running} alt="Man running"></img>
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
                            <div className="p-1 text-orange">Race</div>
                            <div className="p-1">Get tracked by:</div>
                            <div className="p-1 text-orange">100 Ad Trackers</div>
                        </div>
                        <div className="p-1 mb-2"><button className="constSize btn btn-primary">Ready</button></div>
                        <div className="p-1"><button className="constSize btn orange">Leave</button></div>
                    </div>
                </div>
            </div>
            <div className="row d-flex flex-column align-items-center">
                <LobbyChat msgs={this.state.msgs} user_name={this.props.location.state.user_name}></LobbyChat>
            </div>
            <div className="text-center mb-4 mt-2">
                <strong>Wating for players to get ready... Winner: {this.state.temp_winner? this.state.temp_winner: "..."}</strong>
            </div>
            <div className="text-center">
                <button onClick={()=>this.startGame()} className="btn btn-primary constSize">Start Game</button>
            </div>
            <Prompt when={true} message={(location, action)=>{
                console.log(location, action);
                
                return location.pathname==="/lobby"?true:"Are you sure you want to leave?";
            }}></Prompt>
        </div>
    }
}

export default Lobby;