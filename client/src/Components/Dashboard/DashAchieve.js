import React from 'react';
import "../../index.css";
import "./dashboard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import logger from "../Utilities/logger";
import {toast} from 'react-toastify';
import InfoModal from '../Information/InfoModal';

export class DashAchieve extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            modalContent: null,
            achievements: null
        }
        this.getAchievements();

        this.infoTitle = "Achievements information";

        this.infoBody = "After each game, an achievement manager takes the gameplay metrics and checks if the player has passed the conditions to \
        complete an achievement. The purpose of achievements is to increase the rewards a player gets while trying out the game.";
    }
    
    mapStatusColour(completed, progress){
        if (completed){
            return "text-success";
        }else if (progress > 0){
            return "text-warning";
        }else{
            return "text-danger";
        }
    }

    setModalContent(achievement){
        logger.log("trace", `User clicked on achievement ${achievement.title}`, this.props.name);
        var temp_modal_data = <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="achievementLabel">{achievement.title}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row form-group">
                                <label className="col-md-4" htmlFor="difficulty">Difficulty: </label>
                                <input className="col-md-7" id="difficulty" disabled value={achievement.difficulty} />
                            </div>
                            <div className="row form-group">
                                <label className="col-md-4" htmlFor="status">Status: </label>
                                <input className={`${this.mapStatusColour[achievement.user_achievement.completed]} col-md-7`} id="status" disabled value={achievement.user_achievement.completed?"Completed":"Not Completed"} />
                            </div>
                            <div className="row form-group">
                                <label className="col-md-4" htmlFor="game_mode">Game Mode: </label>
                                <input className='col-md-7' id="game_mode" disabled value={achievement.game_mode} />
                            </div>
                            <div className="row form-group">
                                <label className="col-md-4" htmlFor="description">Description: </label>
                                <input type='text-area' className='col-md-7' id="description" disabled value={achievement.achievement_description} />
                            </div>
                            <div className="row form-group">
                                <label className="col-md-4" htmlFor="description">Current Progress: </label>
                                <input type='text-area' className='col-md-7' id="description" disabled value={achievement.user_achievement.progress} />
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                        </div>


        this.setState({modalContent: temp_modal_data})
    }

    buildAchievements(achievements){
        var temp_achievements = achievements.map((ac) => <tr key={ac.achievement_id}>
        <th>{ac.achievement_id}</th>
        <td>{ac.difficulty}</td>
        <td>{ac.title}</td>
        <td><FontAwesomeIcon onClick={()=>this.setModalContent(ac)} data-toggle="modal" data-target="#achievementModal" className="detail-hover text-primary" icon={faInfoCircle} /></td>
        <th className={this.mapStatusColour(ac.user_achievement.completed, ac.user_achievement.progress)}>{ac.user_achievement.completed?"Completed":(ac.user_achievement.progress > 0?"In Progress":"Not Started")}</th>
        </tr>);

        this.setState({achievements: temp_achievements})
    }

    getAchievements = async()=>{
        try {
            var response = await fetch(`/api/userAchievements/${this.props.user_id}`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });

            var parseRes = await response.json();
            // console.log(parseRes)
            this.buildAchievements(parseRes)

        } catch (err){
            toast.error("Failed to retrieve player's game history.");
        }
    }

    render(){
        return <div className="d-flex flex-column align-items-center">
        <div className="row"><h3 className="mr-2">Achievements</h3><InfoModal who="achieveInfo" title={this.infoTitle} text={this.infoBody}></InfoModal></div>
        <div className="table-responsive achieve-scrollbar">
            <table className="table table-borderless">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Difficulty</th>
                        <th scope="col">Title</th>
                        <th scope="col">Details</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.achievements}
                </tbody>
            </table>
        </div>
            <div className="modal fade" id="achievementModal" tabIndex="-1" role="dialog" aria-labelledby="achievementLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                {this.state.modalContent}
            </div>
            </div>
        </div>
    }

}

export default DashAchieve;