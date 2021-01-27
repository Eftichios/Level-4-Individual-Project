import React, { Fragment } from 'react';
import "../../index.css";
import "./dashboard.css";
import DashSettings from './DashSettings';
import DashPlay from './DashPlay';
import DashAchieve from './DashAchieve';
import DashMetrics from './DashMetrics';
import {toast} from 'react-toastify';

export class Dashboard extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {
            name: this.props.location.state? this.props.location.state.user_name:"",
            rank: null,
            from_summary: this.props.location.state?this.props.location.state.game_mode:null
        }

        this.setAuth = props.setAuth;  
        this.user_id = props.user_id;

        this.getUserProfile();
        
    }

    componentDidMount(){
        if (localStorage.hasRefreshed){
            localStorage.removeItem("hasRefreshed");
        }
        
    }

    getAndRankPlayer = async () =>{
        try {
            var response = await fetch("http://localhost:5000/api/userMetrics", {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });

            var parseRes = await response.json();
            this.rankPlayer(parseRes);
        } catch (err){
            toast.error("Failed to retrieve players.");
        }
    }

    rankPlayer(players){
        var temp_sorted = players.sort((a,b) => b.user_metric.tracker_count - a.user_metric.tracker_count);
        var temp_rank = temp_sorted.findIndex(player => player.user_name === this.state.name);
        console.log(temp_rank)
        this.setState({rank: temp_rank+1})
    }

    getUserProfile = async ()=> {
        try {

            const response = await fetch(`http://localhost:5000/api/users/${this.user_id}`, {
                method:"GET",
                headers: {token: localStorage.token, "Content-Type": "application/json"}
            })

            const parseRes = await response.json();

            await this.setState({name: parseRes.user_name})
            this.getAndRankPlayer();

        } catch (err){
            toast.error("Failed to retrieve user details");
        }
    }

    

    render(){
        return <Fragment>
            {!this.props.owns_plugin?<div className="text-secondary">You have indicated that you do not own the extension. Click <a href="https://docs.google.com/document/d/1zIbCuwDIHwgJgykpyYQw8kPiVyl4iTkQkJvB8PoyrjY/edit?usp=sharing">here</a> for instructions on setting everything up.</div>:""}
            <div className="row">
                <div className="col-md-6">
                    <DashPlay name={this.state.name} rank={this.state.rank} user_id={this.props.user_id} from_summary={this.state.from_summary}></DashPlay>
                </div>
                <div className="col-md-6 vertical">
                    <DashSettings user_id={this.props.user_id} name={this.state.name} setAuth={this.setAuth}></DashSettings>
                </div>
            </div>
            <hr />
            <div className="row mt-4">
                <div className="col-md-6">
                    <DashAchieve user_id={this.props.user_id} name={this.state.name}></DashAchieve>
                </div>
                <div className="col-md-6">
                    <DashMetrics user_id={this.props.user_id} name={this.state.name}></DashMetrics>
                </div>
            </div>
        </Fragment>
    }
}

export default Dashboard;