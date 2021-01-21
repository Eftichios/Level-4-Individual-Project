import React from 'react';
import "../../index.css";
import "./summary.css";
import profile from "../../Media/profile.jpeg";
import { LobbyChat } from '../Lobby/LobbyChat';
import { Redirect } from 'react-router-dom';
import {toast} from 'react-toastify';
import socket from "../Utilities/socketConfig";

export class Summary extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            lobbyData: this.props.location.state? this.props.location.state.lobby: null,
            listeners: ["$userLeft", "$chatMessage"],
            msgData: [],
            msgs: null,
            user_left: false,
            user_refreshed: false,
            play_again: false
        }

    }

    componentDidMount(){
        if (this.props.location.state){

            // detect when user closes the tab/browser
            window.addEventListener('beforeunload', this.onUnload);
            window.addEventListener('unload', this.leavingPage);

            socket.on("userLeft", (data)=>{
                this.setState({lobbyData: data});
            });
           

            socket.on("chatMessage", (data)=>{
                var tempData = this.state.msgData.concat(data);
                this.setState({msgData: tempData});
                var msgData = tempData.map((msg, index)=><p className={msg.user_name==="lobby"?"text-italic":""} key={index}><small>[{new Date(msg.date).toLocaleTimeString()}] </small>{msg.message} - <strong className={msg.user_name==="lobby"?"text-info":""}>{msg.user_name}</strong> </p>)
                this.setState({msgs: msgData})
            })
            
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

            this.clear_socket_listeners(socket)
        } else {
            toast.error("Redirected to dashboard. You can only reach the summary page by playing and finishing games.");
        }
    }

    build_game_metrics(){
        var players_sorted = Object.entries(this.props.location.state.game_state.players).sort((a,b)=>{return b[1]["score"]-a[1]["score"]});
        var game_metrics = players_sorted.map((player, index)=>
            <tr key={index}>
                <td>{index}</td>
                <td>{player[0]}</td>
                <td>{player[1]["score"]}</td>
            </tr>
        )
        return game_metrics  
    }

    build_page_history(){
        var page_history = Object.entries(this.props.location.state.player_metrics[this.props.location.state.user_name]["page_history"]).map((key,index)=>
            <tr key={index}>
                <td>{key[0]}</td>
                <td>{key[1]}</td>
            </tr>
        )
        return page_history

    }

    set_play_again(){
        this.setState({play_again: true})
    }

    leaveSummary(){
        if (window.confirm("Are you sure you want to leave?")){
            this.setState({user_left: true})
        }
    }
    

    render(){
        if (!this.state.lobbyData || this.state.user_left || this.state.user_refreshed){
            return <Redirect to="/dashboard"></Redirect>
        }
        if (this.state.play_again){
            return <Redirect to={{pathname: "/dashboard", state: {play_again: true, game_mode: this.state.lobbyData.game_mode, user_name: this.props.location.state.user_name }}}></Redirect>
        }
        return <div className="summary-padding">
            <h3 className="text-center push-down">Summary</h3>
            <div className="row">
                <div className="text-center col-md-4">
                    <h3><strong>{this.props.location.state.winner}</strong> is the winner!</h3>
                    <h5><strong>Game metrics:</strong></h5>
                    <div className="stats-table">
                        <table className="table table-borderless">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Player</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.build_game_metrics()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center col-md-4">
                <h5><strong>Page History</strong></h5>
                <div className="table-wrapper-scroll-y scrollbar">
                    <table className="player-table table table-borderless">
                    <thead>
                        <tr>
                            <th scope="col">Page</th>
                            <th scope="col">Tracker Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.build_page_history()}
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
                            <div className="p-1 text-orange">{this.state.lobbyData.game_mode==="Race"?this.props.location.state.game_state.condition + " Ad Trackers":this.state.lobbyData.category}</div>
                        </div>
                        <div className="p-1"><button onClick={()=>this.set_play_again()} className="constSize btn orange">Play Again</button></div>
                    </div>
                </div>
            </div>
            <div className="row d-flex flex-column align-items-center">
                <LobbyChat room={this.state.lobbyData.room} msgs={this.state.msgs} user_name={this.props.location.state.user_name}></LobbyChat>
            </div>
            <div className="text-center mb-4 mt-2">
                <strong>Game is over. Click on Done to return to the Dashboard.</strong>
            </div>
            <div className="text-center">
                <button onClick={()=>this.leaveSummary()} className="btn btn-primary constSize">Done</button>
            </div>
        </div>
    }
}

export default Summary;