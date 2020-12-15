import React, { Fragment } from 'react';
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
            name: "",
            rank: 4
        }

        this.setAuth = props.setAuth;  
        this.user_id = props.user_id;
    }

    componentDidMount(){
        this.getUserProfile();
    }

    getUserProfile = async ()=> {
        try {

            const response = await fetch(`http://localhost:5000/api/users/${this.user_id}`, {
                method:"GET",
                headers: {token: localStorage.token, "Content-Type": "application/json"}
            })

            const parseRes = await response.json();
            console.log(`Found user with id:${parseRes.user_id}`, parseRes);

            this.setState({name: parseRes.user_name})

        } catch (err){
            console.error(err.message)
        }
    }

    

    render(){
        return <Fragment>
            <div className="row">
                <div className="col-md-6">
                    <DashPlay name={this.state.name} user_id={this.props.user_id}></DashPlay>
                </div>
                <div className="col-md-6 vertical">
                    <DashSettings setAuth={this.setAuth}></DashSettings>
                </div>
            </div>
            <hr />
            <div className="row mt-4">
                <div className="col-md-6">
                    <DashAchieve></DashAchieve>
                </div>
                <div className="col-md-6">
                    <DashMetrics name={this.state.name}></DashMetrics>
                </div>
            </div>
        </Fragment>
    }
}

export default Dashboard;