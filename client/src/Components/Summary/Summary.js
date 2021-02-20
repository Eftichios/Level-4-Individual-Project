import React from 'react';
import "../../index.css";
import "./summary.css";
import { LobbyChat } from '../Lobby/LobbyChat';
import { Redirect } from 'react-router-dom';
import {toast} from 'react-toastify';
import socket from "../Utilities/socketConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

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
            play_again: false,
            modalContent: null,
            user_page_history: null,
            game_metrics: null
        }

    }

    componentDidMount(){
        if (this.props.location.state){
            if (this.props.location.state.game_state.game_mode === "Race"){
                this.build_race_game_metrics();
            } else {
                this.build_category_game_metrics();
            }
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
            });
            
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

    build_race_game_metrics(){
        var players_sorted = Object.entries(this.props.location.state.game_state.players).sort((a,b)=>{return b[1]["score"]-a[1]["score"]});
        var game_metrics = players_sorted.map((player, index)=>
            <tr key={index}>
                <td>{index+1}</td>
                <td><button className="btn btn-link page-history-toggle" onClick={()=>this.build_page_history(player[0])}>{player[0]}</button></td>
                <td>{player[1]["score"]}</td>
            </tr>
        )
        this.build_page_history(this.props.location.state.user_name);
        this.setState({game_metrics: game_metrics});  
    }

    build_category_game_metrics(){
        var players_sorted = Object.entries(this.props.location.state.game_state.players).sort((a,b)=>{return b[1]["categories"].length-a[1]["categories"].length});

        var game_metrics = players_sorted.map((player, index)=>
            <tr key={index}>
                <td>{index+1}</td>
                <td><button className="btn btn-link page-history-toggle" onClick={()=>this.build_category_history(player[0])}>{player[0]}</button></td>
                <td>{player[1]["categories"].length}</td>
            </tr>)
        
        this.build_category_history(this.props.location.state.user_name);
        this.setState({game_metrics: game_metrics});
    }

    build_category_history(user_name){
        var temp_cat_count = this.props.location.state.game_state.players[user_name]["categories"].reduce((total, cat)=>{
            total[cat] = (total[cat] || 0) + 1;
            return total;
        },{})

        var category_history = Object.entries(temp_cat_count).map((key,index)=>
            <tr key={index}>
                <td>{key[0]}</td>
                <td>{key[1]}</td>
            </tr>
        )
        this.setState({user_category_history: category_history});
    }

    setModalContent(trackers){
        var temp_list = trackers.map((key,index)=><p key={index}>{index+1}. {key}</p>)
        this.setState({modalContent: temp_list});
    }

    build_page_history(user_name){
        
        var page_history = Object.entries(this.props.location.state.player_metrics[user_name]["page_history"]).map((key,index)=>
            <tr key={index}>
                <td>{key[0]}</td>
                <td>{key[1]["count"]} 
                    <FontAwesomeIcon onClick={()=>this.setModalContent(key[1]["trackers"])} data-toggle="modal" data-target="#trackerModal" className="ml-2 detail-hover text-primary" icon={faInfoCircle} />
                </td>
            </tr>
        )
        this.setState({user_page_history: page_history});

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
                                    <th>{this.state.lobbyData.game_mode==="Race"?"Score":"Categories Found"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.game_metrics}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center col-md-4">
                <h5><strong>{this.state.lobbyData.game_mode==="Race"?"Page History":"Categories Count"}</strong></h5>
                <div className="table-wrapper-scroll-y scrollbar">
                    <table className="player-table table table-borderless">
                    <thead>
                        <tr>
                        <th scope="col">{this.state.lobbyData.game_mode==="Race"?"Page":"Category"}</th>
                            <th scope="col">{this.state.lobbyData.game_mode==="Race"?"Tracker Count":"Count"}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.lobbyData.game_mode==="Race"?this.state.user_page_history:this.state.user_category_history}
                    </tbody>
                    </table>
                </div>
            </div>    
                <div className="col-md-4">
                    <div className="float-right pr-5 d-flex flex-column align-items-center">
                    <div className="p-1"><img className="lobby-profile" src={process.env.PUBLIC_URL +"/bots/"+this.props.location.state.profile} alt="Profile" /></div>
                        <div className="p-1 mb-4"><h3><strong>{this.props.location.state.user_name}</strong></h3></div>
                        <div className="mb-4 d-flex flex-column align-items-center game-details">
                            <div className="p-1">Game Mode:</div>
                            <div className="p-1 text-orange">{this.state.lobbyData.game_mode}</div>
                            <div className="p-1">{this.state.lobbyData.game_mode==="Race"?"Get tracked by:":"Category"}</div>
                            <div className="p-1 text-orange">{this.state.lobbyData.game_mode==="Race"?this.props.location.state.game_state.condition + " Ad Trackers":this.state.lobbyData.condition}</div>
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
            <div className="modal fade" id="trackerModal" tabIndex="-1" role="dialog" aria-labelledby="trackerLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="trackerLabel">Trackers Found</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {this.state.modalContent}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>
        </div>
    }
}

export default Summary;