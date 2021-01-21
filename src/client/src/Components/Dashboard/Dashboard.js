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
            rank: 4,
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

    getUserProfile = async ()=> {
        try {

            const response = await fetch(`http://localhost:5000/api/users/${this.user_id}`, {
                method:"GET",
                headers: {token: localStorage.token, "Content-Type": "application/json"}
            })

            const parseRes = await response.json();

            this.setState({name: parseRes.user_name})

        } catch (err){
            toast.error("Failed to retrieve user details");
        }
    }

    

    render(){
        return <Fragment>
            <div className="row">
                <div className="col-md-6">
                    <DashPlay name={this.state.name} user_id={this.props.user_id} from_summary={this.state.from_summary}></DashPlay>
                </div>
                <div className="col-md-6 vertical">
                    <DashSettings name={this.state.name} setAuth={this.setAuth}></DashSettings>
                </div>
            </div>
            <hr />
            <div className="row mt-4">
                <div className="col-md-6">
                    <DashAchieve name={this.state.name}></DashAchieve>
                </div>
                <div className="col-md-6">
                    <DashMetrics user_id={this.props.user_id} name={this.state.name}></DashMetrics>
                </div>
            </div>
        </Fragment>
    }
}

export default Dashboard;