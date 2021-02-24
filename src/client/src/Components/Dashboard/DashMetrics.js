import React from 'react';
import "../../index.css";
import "./dashboard.css";
import Chart from "react-google-charts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import DashGameHistory from './DashGameHistory';
import {toast} from 'react-toastify';
import DashTrackers from './DashTrackers';


export class DashMetrics extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {
            total_trackers: 0,
            games_played: {'Race': 0, 'Category': 0},
            categories: [],
            trackers: [],
            user_metrics: null,
            total_adverts: 0
        }

    }

    componentDidMount(){
        this.getUserMetrics();
    }

    getUserMetrics = async () =>{
        try {
            var response = await fetch(`http://localhost:5000/api/userMetrics/${this.props.user_id}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });

            if (response.status === 200){
                var parseRes = await response.json();
                await this.setState({user_metrics: parseRes})
                this.buildGameMetrics(parseRes);
            } 
        } catch (err){
            console.error(err.message)
            toast.error("Failed to retrieve player's game metrics.");
        }
    }

    buildGameMetrics(metrics){
        var cat_count = [["Category", "Ads delievered"]];
        var total_adverts = 0;
        Object.keys(metrics.categories_count).forEach((key)=> {
            cat_count.push([key,metrics.categories_count[key]]);
            total_adverts += metrics.categories_count[key];
        });
        this.setState({categories: cat_count, 
            total_trackers: metrics.total_ad_trackers, 
            games_played: {"Race": metrics.race_games, "Category": metrics.category_games},
            total_adverts: total_adverts});
    }

    render(){
        return <div className="row">
            <div className="col-md-6">
                <div className="text-center">
                    <h3>Metrics</h3>
                    <p>Games Played: <strong>{this.state.games_played['Race'] + this.state.games_played['Category']}</strong> 
                    <FontAwesomeIcon title={`Race: ${this.state.games_played['Race']} | Category: ${this.state.games_played['Category']}`}className="ml-2 tooltip-hover text-primary" icon={faInfoCircle} />
                    </p>
                    <DashTrackers user_metrics={this.state.user_metrics}></DashTrackers>
                    <div className="chart align-items-center">
                        <h5>Total adverts served: {this.state.total_adverts}</h5>
                        <Chart
                            width={'30vh'}
                            height={'30vh'}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}
                            data={this.state.categories}
                            options={{
                                backgroundColor: 'transparent',
                                legend: 'none',
                                chartArea: {'width': '100%', 'height': '80%'}
                            }}
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </div>
                </div>
            </div>
            <div className="col-md-6 text-center ">
                <DashGameHistory name={this.props.name} user_id={this.props.user_id} />
            </div>
            </div>
    }

}

export default DashMetrics;