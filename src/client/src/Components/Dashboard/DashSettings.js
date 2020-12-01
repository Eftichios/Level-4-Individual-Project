import React from 'react';
import "../../index.css";
import "./dashboard.css";
import { toast } from 'react-toastify';

export class DashSettings extends React.Component {

    constructor(props){
        super(props);

        this.setAuth = props.setAuth;
    }

    logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");

        this.setAuth(false);
        toast.success("Logged out succesfully!")
    }

    render(){
        return  <div className="d-flex flex-column align-items-center">
                    <div className="p-1"><h3>Settings</h3></div>
                    <div className="p-1"><button onClick={(e)=>this.logout(e)} className="constSize btn btn-primary">Logout</button></div>
                    <div className="p-1"><button className="constSize btn btn-secondary">Change Password</button></div>
                    <div className="p-1"><button className="constSize btn btn-danger">Delete Account</button></div>
                </div>
    }

}

export default DashSettings;