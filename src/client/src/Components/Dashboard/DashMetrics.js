import React from 'react';
import "../../index.css";
import "./dashboard.css";
import Chart from "react-google-charts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import DashGameHistory from './DashGameHistory';
import category_map from "../Utilities/adCategories";
import {toast} from 'react-toastify';
import DashTrackers from './DashTrackers';

export class DashMetrics extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {
            total_trackers: 0,
            games_played: {'Race': 0, 'Category': 0},
            categories: [],
            trackers: []
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
                this.buildGameMetrics(parseRes);
            } 
        } catch (err){
            console.error(err.message)
            toast.error("Failed to retrieve player's game metrics.");
        }
    }

    buildGameMetrics(metrics){
        var cat_count = [["Category", "Ads delievered"]];
        metrics.categories_count.forEach((count, index)=>cat_count.push([category_map[index],count]));
        this.setState({categories: cat_count, total_trackers: metrics.total_ad_trackers, games_played: {"Race": metrics.race_games, "Category": metrics.category_games}});
        console.log(metrics);
        this.buildTrackers(metrics.tracker_list)
    }

    buildTrackers(tracker_list){
        var tracker_els = Object.entries(tracker_list).slice(500,600).map((tracker,index)=>
            <div key={index} className="col-md-6 text-left"><textarea className={tracker[1]===true?"text-success tracker_item":"text-secondary tracker_item"} value={tracker[0]} readOnly></textarea></div>
        );
        this.setState({trackers: tracker_els})
    }

    render(){
        return <div className="row">
            <div className="col-md-6">
                <div className="text-center">
                    <h3>Metrics</h3>
                    <p>Games Played: <strong>{this.state.games_played['Race'] + this.state.games_played['Category']}</strong> 
                    <FontAwesomeIcon title={`Race: ${this.state.games_played['Race']} | Category: ${this.state.games_played['Category']}`}className="ml-2 tooltip-hover text-primary" icon={faInfoCircle} />
                    </p>
                    <DashTrackers trackers={this.state.trackers}></DashTrackers>
                    <div className="chart align-items-center">
                        <h5>Ad categories seen</h5>
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