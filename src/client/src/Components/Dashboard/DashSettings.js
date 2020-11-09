import React from 'react';
import "../../index.css";
import "./dashboard.css";

export class DashSettings extends React.Component {

    constructor(props){
        super(props);

        this.state = props;
    }

    render(){
        return  <div className="d-flex flex-column align-items-center">
                    <div className="p-1"><h3>Settings</h3></div>
                    <div className="p-1"><button className="constSize btn btn-secondary">Change Password</button></div>
                    <div className="p-1"><button className="constSize btn btn-danger">Delete Account</button></div>
                </div>
    }

}

export default DashSettings;