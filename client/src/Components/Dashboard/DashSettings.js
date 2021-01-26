import React from 'react';
import "../../index.css";
import "./dashboard.css";
import { toast } from 'react-toastify';
import logger from '../Utilities/logger';

export class DashSettings extends React.Component {

    constructor(props){
        super(props);

        this.setAuth = props.setAuth;

        this.state = {
            old_pass: "",
            new_pass: ""
        }

        this.onChange = e => {
            this.setState({[e.target.name]: e.target.value});
          };

          this.onSubmitForm = async (e) => {
            e.preventDefault();

            try {
              const response = await fetch(`api/users/${this.props.user_id}`, {
                method:"PUT",
                headers: {token: localStorage.token, "Content-Type": "application/json"},
                body: JSON.stringify({"old_pass": this.state.old_pass, "new_pass": this.state.new_pass, "user_id": this.props.user_id})
              });

              const parseRes = await response.json();

              if (parseRes.success){     
                toast.success("Password changed succesfully.");
              }else{
                toast.error(parseRes.msg);
              }
            } catch (err){
              console.error(err.message)
              toast.error(err.message);
            }

          }
    }

    logout = (e) => {
        logger.log("info", "User logged out.", this.props.name)
        e.preventDefault();
        localStorage.removeItem("token");

        this.setAuth(false);
        toast.success("Logged out succesfully!")
    }

    render(){
        return  <div className="d-flex flex-column align-items-center">
                <div className="modal fade" id="changePassword" tabIndex="-1" role="dialog" aria-labelledby="changePasswordLabel" aria-hidden="true">
                <div className="modal-dialog modal-md" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="changePasswordLabel">Change Password</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div>
                    <form className="col-12" onSubmit={this.onSubmitForm}>
                        <div className="form-group">
                            <label htmlFor="oldPassInput">Old Password:</label>
                            <input name="old_pass" type="password" className="form-control" id="oldPassInput" placeholder="Old Password" value={this.state.old_pass} onChange={(e)=>this.onChange(e)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassInput">New Password:</label>
                            <input name="new_pass" type="password" className="form-control" id="newPassInput" placeholder="New Password" value={this.state.new_pass} onChange={(e)=>this.onChange(e)} />
                        </div>
                        <div className="text-center">
                            <button value="submit" className="constSize btn btn-primary">Submit</button>
                            <button type="button" data-dismiss="modal" className="constSize btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                    </div>
                    </div>
                </div>
                </div>
                <div className="p-1"><h3>Settings</h3></div>
                <div className="p-1"><button onClick={(e)=>this.logout(e)} className="constSize btn btn-primary">Logout</button></div>
                <div className="p-1"><button className="constSize btn btn-secondary" data-toggle="modal" data-target="#changePassword">Change Password</button></div>
                <div className="p-1"><button className="constSize btn btn-danger">Delete Account</button></div>
                </div>
    }

}

export default DashSettings;