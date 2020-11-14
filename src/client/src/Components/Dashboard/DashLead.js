import React from 'react';
import "../../index.css";
import "./dashboard.css";

export class DashLead extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            user: props.user
        }

        class Players {
            constructor(rank, name, games, count){
                this.rank=rank;
                this.name=name;
                this.games=games;
                this.count=count;
            }
        }

        this.players_data = [new Players(1,"George",15,1432), 
                        new Players(2,"Jacob",13,1143),
                        new Players(3,"Larry",11,1008),
                        new Players(4,"Peter",10,911),
                        new Players(5,"Maria",9,789),
                        new Players(6,"John",11,741),
                        new Players(7,"Elizabeth",10,734),
                        new Players(8,"Graham",7,597),
                        new Players(9,"Bruce",7,532),
                        new Players(10,"Liam",3,214),]
        
        this.players = this.players_data.map((player)=><tr>
            <td>{player.rank}</td>
            <td>{player.name===this.state.user? <strong>{player.name}</strong>:player.name}</td>
            <td>{player.games}</td>
            <td>{player.count}</td>
            </tr>)
    }

    render(){
        return <div>
                <div className="p-1"><button className="constSize btn orange" data-toggle="modal" data-target="#leaderboard">View Leaderboards</button></div>
                <div className="modal fade" id="leaderboard" tabindex="-1" role="dialog" aria-labelledby="leaderboardLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="leaderboardLabel">Leaderboards</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        <table className="table table-borderless">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Player</th>
                                    <th scope="col">Games Played</th>
                                    <th scope="col">Distinct Trackers</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.players}
                            </tbody>
                        </table>
                        </div>
                    <div className="modal-footer">
                        <div className="input-group not-full">
                            <input type="text" className="form-control" placeholder="Search Player" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button">Search</button>
                            </div>
                        </div>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
                </div>
               </div>
    }

}

export default DashLead;