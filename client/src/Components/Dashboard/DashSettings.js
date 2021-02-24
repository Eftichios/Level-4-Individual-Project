import React from 'react';
import "../../index.css";
import "./dashboard.css";
import { toast } from 'react-toastify';
import logger from '../Utilities/logger';
import InfoModal from '../Information/InfoModal';

export class DashSettings extends React.Component {

    constructor(props){
        super(props);

        this.setAuth = props.setAuth;

        this.state = {
            old_pass: "",
            new_pass: "",
            bug_description: "",
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

        this.onSubmitBug = async (e)=>{
          e.preventDefault();
          try {
              const response = await fetch(`api/bugReport`, {
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({"bug_description": this.state.bug_description, "user_name": this.props.name})
              });
  
              const parseRes = await response.json();
  
              if (parseRes){     
                this.setState({bug_description: ""})
                toast.success("Bug report submitted succesfully.");
              }else{
                toast.error("Failed to submit bug report");
              }
            } catch (err){
              console.error(err.message)
              toast.error(err.message);
            }
        }

          this.infoTitle = "How to play the game?"

          this.infoBody = <div><p>To play the game you must have the corresponding chrome extension installed. Instructions on how to set everything up can be found in the about page (you 
            can navigate to the about page by expanding the navigation side bar). With the extension installed, select a game mode and click on Find Game, this will put you in a lobby. In the lobby 
            you must indicate that you are ready before the game can start. As soon as all players are ready, any one of the players can start the game.</p><p><strong>Race mode:</strong> The goal of this game mode 
            is to get tracked by the number of unique trackers given in the lobby. To get tracked by ad trackers, simply visit any website. You can view 
            feedback on how you are progressing from the interface of the extension.</p><p><strong>Category mode(experimental):</strong> To play this game mode, you need to 
            disable any ad blockers. In this game mode, you are given a random advert category in the lobby. The purpose of the game is to visit websites in a calculated way such that 
            you receive an advert on the given category. The first player to receive an advert in that category is the winner. For example, if the advert category is Food and you see an 
            advert related to Food first you win (e.g an advert for a restaurant). </p>
            <div><strong>Tips and tricks for the Race mode:</strong>
              <ul>
                <li>Examples of websites that have a lot of trackers are news websites or blogs.</li>
                <li>Websites that do their own tracking usually don't have a lot of trackers (i.e Facebook, YouTube, Twitter...)</li>
                <li>Accepting cookies when first visiting a website increases the number of trackers.</li>
              </ul>
            </div>
            <div><strong>Tips and tricks for the Category mode:</strong>
              <ul>
                <li>Use a fresh broswer account. Details on how to create a fresh browser account can be found in the set up instructions.</li>
                <li>When the game starts, spend a few minutes building your interest profile. For example, if you are given the Food category, browse the web
                  in a way that shows you are interested in Food. For example, visiting food blogs or restaurant menus.
                </li>
                <li>After building your interest profile, visit websites that have a lot of adverts.</li>
                <li>If you are still seeing unrelated adverts, spend some more time building your interest profile (try different strategies)</li>
                <li>Finally, for each new game, you can clear your browsing history to reset your interest profile (remember to use the fresh browser account)</li>
              </ul>
            </div>
            <p>If you have any questions about the game or the project in general, you can email me: 2329664k@student.gla.ac.uk</p></div>
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
                <div className="modal fade" id="bugReport" tabIndex="-1" role="dialog" aria-labelledby="bugReportLabel" aria-hidden="true">
                <div className="modal-dialog modal-md" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="bugReportLabel">Report a Bug</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div>
                    <form className="col-12" onSubmit={this.onSubmitBug}>
                        <div className="mt-2 form-group">
                            <label htmlFor="bugDescriptionInput">Please describe the bug:</label>
                            <textarea rows="7" name="bug_description" type="textarea" className="form-control" id="bugDescriptionInput" placeholder="Bug description" value={this.state.bug_description} onChange={(e)=>this.onChange(e)} />
                        </div>
                        <div className="text-center">
                            <button disabled={this.state.bug_description.length === 0 } value="submit" className="constSize btn btn-primary">Submit</button>
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
                {/* <div className="p-1"><button className="constSize btn btn-danger">Delete Account</button></div> */}
                <div className="p-1"><InfoModal who="gameInfo" title={this.infoTitle} text={this.infoBody} button={true}></InfoModal></div>
                <div className="p-1"><button className="constSize btn btn-danger" data-toggle="modal" data-target="#bugReport">Report a Bug</button></div>
                </div>
    }

}

export default DashSettings;