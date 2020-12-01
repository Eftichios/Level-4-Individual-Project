import React from 'react';
import "../../index.css";
import "./dashboard.css";
import profile from "../../Media/profile.jpeg";
import DashLead from './DashLead';

export class DashPlay extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            name: props.name,
            rank: props.rank
        };
    }

    render(){
        return <div className="d-flex flex-column align-items-center">
                <div className="p-1"><img className="profile" src={profile} alt="Profile" /></div>
                <div className="p-1">Player: {this.state.name}</div>
                <div className="p-1">Rank: {this.state.rank}</div>
                <div className="p-1"><button className="constSize btn btn-primary">Play Game</button></div>
                <div className="p-1"><DashLead user="George"></DashLead></div>
                <div className="p-1"><button className="constSize btn btn-secondary" >Game Mode</button></div>
               </div>
    }

}

export default DashPlay;