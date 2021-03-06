import React from 'react';
import "../../index.css";
import "./dashboard.css";
import {toast} from 'react-toastify';

export class DashLead extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            user: props,
            players: null,
            search_query: ""
        }
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    onSubmitForm = async (e) => {
        e.preventDefault();
        
        try {
          const response = await fetch(`http://localhost:5000/api/userMetrics/search`, {
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({user: this.state.search_query})
          });
  
          const parseRes = await response.json();
          if (parseRes){
            this.sortAndBuildPlayers(parseRes);   
          } 

        } catch (err){
          console.error(err.message)
        }
        
      }

    getAndSortPlayers = async () =>{
        try {
            var response = await fetch("http://localhost:5000/api/userMetrics", {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });

            var parseRes = await response.json();
            this.sortAndBuildPlayers(parseRes);
        } catch (err){
            toast.error("Failed to retrieve players.");
        }
    }

    sortAndBuildPlayers(players){
        var players_sorted = players.sort((a,b) => b.user_metric.tracker_count - a.user_metric.tracker_count);
        var temp_table = players_sorted.map((player, index)=>
            <tr key={index}>
                <td>{index+1}</td>
                <td>{player.user_name}</td>
                <td>{player.user_metric.tracker_count}</td>
            </tr>
        );

        this.setState({players: [temp_table]});
    }

    componentDidMount(){
        this.getAndSortPlayers()
    }

    render(){
        return <div>
                <div className="p-1"><button className="constSize btn orange" data-toggle="modal" data-target="#leaderboard">View Leaderboards</button></div>
                <div className="modal fade" id="leaderboard" tabIndex="-1" role="dialog" aria-labelledby="leaderboardLabel" aria-hidden="true">
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
                                    <th scope="col">Unique Trackers</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.players}
                            </tbody>
                        </table>
                        {this.state.players?"":<h3>Loading...</h3>}
                        </div>
                    <div className="modal-footer">
                        <div className="input-group not-full">
                            <input name="search_query" type="text" className="form-control" placeholder="Search Player" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e)=>this.onChange(e)}/>
                            <div className="input-group-append">
                                <button onClick={(e)=>this.onSubmitForm(e)} className="btn btn-primary" type="button">Search</button>
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