import React, { Fragment } from 'react';
import "../../index.css";
import "./dashboard.css";

export class DashGameHistory extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            game_stats: "",
            show_all: true
        };

        class GameHistory{

            constructor(id, date, win, game_mode, time_elapsed, game_stats){
                this.id = id;
                this.date = date;
                this.win = win;
                this.game_mode = game_mode;
                this.time_elapsed = time_elapsed;
                this.game_stats = game_stats;
            }
        }

        this.game_history_data = [new GameHistory(1, new Date(), true, 'Race', new Date().getMinutes(), {'players': ['test_user','user_2','user_3'],
                                                                                                                'scores': [100,93,16],
                                                                                                                'condition':'Get tracked by 100 ad trackers.'}),
                                    new GameHistory(2, new Date(), false, 'Category', new Date().getMinutes(), {'players': ['test_user','user_2','user_3'],
                                                                                                                'scores': [100,93,16],
                                                                                                                'condition':'Get tracked by 100 ad trackers.'}),
                                    new GameHistory(3, new Date(), false, 'Category', new Date().getMinutes(), {'players': ['test_user','user_2','user_3'],
                                                                                                                'scores': [100,93,16],
                                                                                                                'condition':'Get tracked by 100 ad trackers.'}),
                                    new GameHistory(4, new Date(), true, 'Race', new Date().getMinutes(), {'players': ['test_user','user_2','user_3'],
                                                                                                                'scores': [100,93,16],
                                                                                                                'condition':'Get tracked by 100 ad trackers.'}),
                                    new GameHistory(5, new Date(), false, 'Race', new Date().getMinutes(), {'players': ['test_user','user_2','user_3'],
                                                                                                                'scores': [100,93,16],
                                                                                                                'condition':'Get tracked by 100 ad trackers.'})
                                ];

        this.game_history = this.game_history_data.map((game)=><tr key={game.id}>
            <td>{game.date.toDateString()}</td>
            <th className={game.win?'text-success':'text-danger'}>{game.win? 'W': 'L'}</th>
            <td><button className="btn btn-sm btn-info" onClick={()=>this.setModalData(game.game_stats)}>{game.game_mode}</button></td>
            <td>{game.time_elapsed}</td>
        </tr>)

        this.modalContentAll = <Fragment><div className="modal-header">
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
                                                    {this.game_history}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        </div> 
                                </Fragment>

    }

    setModalData(game) {
        const temp_content = <Fragment>
            <div className="modal-header">
                <h5 className="modal-title" id="gameHistoryLabel">Game stats</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
               </div>
            <div class="modal-body">
                    <div className="row form-group">
                        <label className="col-md-4" htmlFor="condition">Condition: </label>
                        <input className="col-md-7" id="condition" disabled value={game.condition} />
                    </div>
                    {game['players'].map((name, index)=><div key={index} className="row form-group">
                        <label className="col-md-4" htmlFor="status">{name===this.props.name? <strong>name</strong>:name}: </label>
                        <input disabled value={`Score ${game.scores[index]}`} />
                    </div>)}
                    
            </div>
            <div className="modal-footer">
                <button onClick={()=>this.resetModalData()} type="button" className="btn btn-secondary">Back</button>
            </div> 
        </Fragment>
        this.setState({show_all: false, game_stats: temp_content});
        
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
                        {this.state.show_all? this.modalContentAll: this.state.game_stats}

                    </div>
                </div>
                </div>
            </div>
    }

}

export default DashGameHistory;