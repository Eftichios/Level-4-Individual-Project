import React from 'react';
import "../../index.css";
import "./dashboard.css";

export class DashMetrics extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            user: "George"
        };
    }

    render(){
        return <div className="row">
            <div className="col-md-6">
                <div className="card text-center">
                    <h3>Metrics</h3>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card mr-2 text-center">
                    <h3>Game History</h3>
                </div>
            </div>
            </div>
    }

}

export default DashMetrics;