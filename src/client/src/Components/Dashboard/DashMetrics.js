import React from 'react';
import "../../index.css";
import "./dashboard.css";
import Chart from "react-google-charts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import DashGameHistory from './DashGameHistory';

export class DashMetrics extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {
            total_trackers: 1521
        }

        this.games_played = {'Race': 12, 'Category': 4}

    }
    render(){
        return <div className="row">
            <div className="col-md-6">
                <div className="text-center">
                    <h3>Metrics</h3>
                    <p>Games Played: <strong>{this.games_played['Race'] + this.games_played['Category']}</strong> 
                    <FontAwesomeIcon title={`Race: ${this.games_played['Race']} | Category: ${this.games_played['Category']}`}className="ml-2 tooltip-hover text-primary" icon={faInfoCircle} />
                    </p>
                    <p>Total trackers: <strong>{this.state.total_trackers}</strong></p>
                    <div className="chart align-items-center">
                        <h5>Ad categories seen</h5>
                        <Chart
                            width={'30vh'}
                            height={'30vh'}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Category', 'Ads delivered'],
                                ['Health', 11],
                                ['Technology', 4],
                                ['Education', 1],
                                ['Travel', 12],
                                ['Gambling', 7],
                            ]}
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
                <DashGameHistory />
            </div>
            </div>
    }

}

export default DashMetrics;