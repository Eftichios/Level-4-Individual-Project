import React, { Fragment } from 'react';
import "../../index.css";
import "./dashboard.css";
import {toast} from 'react-toastify';
import logger from '../Utilities/logger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export class DashGameHistory extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            game_stats: "",
            show_all: true,
            game_history: null,
            modalContentAll: null,
            modalContentTrackers: null
        };
    }

    componentDidMount(){
        this.getGameHistory();
    }

    getGameHistory = async()=>{
        try {
            var response = await fetch(`/api/gameHistory/${this.props.user_id}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });

            var parseRes = await response.json();
            this.buildModalContent(parseRes);
        } catch (err){
            toast.error("Failed to retrieve player's game history.");
        }
    }

    buildModalContent = (game_history) => {
        var all_games = game_history.map((game)=><tr key={game.game_id}>
            <td>{game.game_date}</td>
            <th className={game.winner_id===this.props.user_id?'text-success':'text-danger'}>{game.winner_id===this.props.user_id? 'W': 'L'}</th>
            <td><button className="btn btn-sm btn-info" onClick={()=>this.setModalData(game)}>{game.game_mode}</button></td>
            <td>{game.game_stats.time_elapsed===0? ">1 min": game.game_stats.time_elapsed + " min"}</td>
        </tr>)
        var temp_data = <Fragment><div className="modal-header">
                                    <h5 className="modal-title" id="gameHistoryLabel">Game History</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>
                                    <div className="modal-body text-center">
                                        <table className="table table-borderless">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Win/Loss</th>
                                                    <th scope="col">Game Mode</th>
                                                    <th scope="col">Time Elapsed(m)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {all_games}
                                            </tbody>
                                        </table>
                                        {game_history.length===0?<div className="text-center">No game history found</div>:""}
                                    </div>
                                    <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div> 
                                </Fragment>
        this.setState({modalContentAll: temp_data})
    }

    setModalData(game) {
        logger.log("trace",`User viewed history of game ${game.game_id}`, this.props.name)
        const temp_content = <Fragment>
            <div className="modal-header">
                <h5 className="modal-title" id="gameHistoryLabel">Game stats</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
               </div>
            <div className="modal-body">
                <div className="row form-group">
                    <label className="col-md-4" htmlFor="condition">Condition: </label>
                    <input className="col-md-7" id="condition" disabled value={"Find " + game.game_stats.win_condition +" Trackers."} />
                </div>
                {Object.keys(game.player_stats).map((name, index)=><div key={index} className="row form-group">
                    <label className="col-md-4" htmlFor="status">{name===this.props.name? <strong>{name}</strong>:name}: </label>
                    <input disabled value={`Score ${game.player_stats[name]["score"]}`} />
                </div>)}
                <h5 className="text-center">Page History</h5>
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            <th>Url</th>
                            <th>Ad Trackers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(game.player_stats[this.props.name]["page_history"]).map((page, index) => 
                        <tr key={index}>
                            <td>{page}</td>
                            <td>{game.player_stats[this.props.name]["page_history"][page]["count"]}
                                <FontAwesomeIcon onClick={()=>this.setTrackersModalContent(game.player_stats[this.props.name]["page_history"][page]["trackers"])} data-toggle="modal" data-target="#trackerModal" className="ml-2 detail-hover text-primary" icon={faInfoCircle} />
                            </td>
                        </tr>)}
                    </tbody>
                </table>      
            </div>
            <div className="modal-footer">
                <button onClick={()=>this.resetModalData()} type="button" className="btn btn-secondary">Back</button>
            </div> 
        </Fragment>
        this.setState({show_all: false, game_stats: temp_content});
        
    }

    setTrackersModalContent(trackers){
        var temp_list = trackers.map((key,index)=><p key={index}>{index+1}. {key}</p>)
        this.setState({modalContentTrackers: temp_list});
    }

    resetModalData() {
        this.setState({show_all:true});
    }

    render(){
        return  <div>
                <h3>Game History</h3>
                <div className="p-1 center-button "><button className="constSize btn orange" data-toggle="modal" data-target="#game_history">View Game History</button></div>
                <div className="modal fade" id="game_history" tabIndex="-1" role="dialog" aria-labelledby="gameHistoryLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        {this.state.show_all? this.state.modalContentAll: this.state.game_stats}

                    </div>
                </div>
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
                        {this.state.modalContentTrackers}
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

export default DashGameHistory;