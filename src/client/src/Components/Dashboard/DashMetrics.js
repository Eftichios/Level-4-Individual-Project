import React from 'react';
import "../../index.css";
import "./dashboard.css";

export class DashMetrics extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            user: "George"
        };

        class GameHistory{

            constructor(id, date, win, game_mode, time_elapsed){
                this.id = id;
                this.date = date;
                this.win = win;
                this.game_mode = game_mode;
                this.time_elapsed = time_elapsed;
            }
        }

        this.game_history_data = [new GameHistory(1, new Date(), true, 'Race', new Date().getMinutes()),
                                    new GameHistory(2, new Date(), false, 'Category', new Date().getMinutes()),
                                    new GameHistory(3, new Date(), false, 'Category', new Date().getMinutes()),
                                    new GameHistory(4, new Date(), true, 'Race', new Date().getMinutes()),
                                    new GameHistory(5, new Date(), false, 'Race', new Date().getMinutes())
                                ];

        this.game_history = this.game_history_data.map((game)=><tr key={game.id}>
            <td>{game.date.toDateString()}</td>
            <th className={game.win?'text-success':'text-danger'}>{game.win? 'W': 'L'}</th>
            <td>{game.game_mode}</td>
            <td>{game.time_elapsed}</td>
        </tr>)
    }

    render(){
        return <div className="row">
            <div className="col-md-6">
                <div className="text-center">
                    <h3>Metrics</h3>
                </div>
            </div>
            <div className="col-md-6">
                <div className="mr-2 text-center">
                    <h3>Game History</h3>
                    <div className="table-responsive achieve-scrollbar">
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
                </div>
            </div>
            </div>
    }

}

export default DashMetrics;