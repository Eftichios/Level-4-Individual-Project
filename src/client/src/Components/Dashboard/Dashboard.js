import React from 'react';
import "../../index.css";
import "./dashboard.css";
import DashSettings from './DashSettings';
import DashPlay from './DashPlay';
import DashAchieve from './DashAchieve';
import DashMetrics from './DashMetrics';

export class Dashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: "George",
            rank: 4
        }
    }

    render(){
        return <div>
            <div className="row">
                <div className="col-md-6">
                    <DashPlay name={this.state.name} rank={this.state.rank}></DashPlay>
                </div>
                <div className="col-md-6 vertical">
                    <DashSettings></DashSettings>
                </div>
            </div>
            <hr />
            <div className="row mt-4">
                <div className="col-md-6">
                    <DashAchieve></DashAchieve>
                </div>
                <div className="col-md-6">
                    <DashMetrics></DashMetrics>
                </div>
            </div>
        </div>
    }
}

export default Dashboard;